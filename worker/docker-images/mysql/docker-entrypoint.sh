#!/bin/bash
set -eo pipefail
shopt -s nullglob
mysql_log() {
	local type="$1"; shift
	printf '%s [%s] [Entrypoint]: %s\n' "$(date --rfc-3339=seconds)" "$type" "$*"
}
mysql_note() {
	mysql_log Note "$@"
}
mysql_warn() {
	mysql_log Warn "$@" >&2
}
mysql_error() {
	mysql_log ERROR "$@" >&2
	exit 1
}
file_env() {
	local var="$1"
	local fileVar="${var}_FILE"
	local def="${2:-}"
	if [ "${!var:-}" ] && [ "${!fileVar:-}" ]; then
		mysql_error "Both $var and $fileVar are set (but are exclusive)"
	fi
	local val="$def"
	if [ "${!var:-}" ]; then
		val="${!var}"
	elif [ "${!fileVar:-}" ]; then
		val="$(< "${!fileVar}")"
	fi
	export "$var"="$val"
	unset "$fileVar"
}
_is_sourced() {
	[ "${#FUNCNAME[@]}" -ge 2 ] \
		&& [ "${FUNCNAME[0]}" = '_is_sourced' ] \
		&& [ "${FUNCNAME[1]}" = 'source' ]
}
docker_process_init_files() {
	mysql=( docker_process_sql )
	echo
	local f
	for f; do
		case "$f" in
			*.sh)
				if [ -x "$f" ]; then
					mysql_note "$0: running $f"
					"$f"
				else
					mysql_note "$0: sourcing $f"
					. "$f"
				fi
				;;
			*.sql)    mysql_note "$0: running $f"; docker_process_sql < "$f"; echo ;;
			*.sql.gz) mysql_note "$0: running $f"; gunzip -c "$f" | docker_process_sql; echo ;;
			*.sql.xz) mysql_note "$0: running $f"; xzcat "$f" | docker_process_sql; echo ;;
			*)        mysql_warn "$0: ignoring $f" ;;
		esac
		echo
	done
}
mysql_check_config() {
	local toRun=( "$@" --verbose --help ) errors
	if ! errors="$("${toRun[@]}" 2>&1 >/dev/null)"; then
		mysql_error $'mysqld failed while attempting to check config\n\tcommand was: '"${toRun[*]}"$'\n\t'"$errors"
	fi
}
mysql_get_config() {
	local conf="$1"; shift
	"$@" --verbose --help --log-bin-index="$(mktemp -u)" 2>/dev/null \
		| awk -v conf="$conf" '$1 == conf && /^[^ \t]/ { sub(/^[^ \t]+[ \t]+/, ""); print; exit }'
}
docker_temp_server_start() {
	if [ "${MYSQL_MAJOR}" = '5.6' ] || [ "${MYSQL_MAJOR}" = '5.7' ]; then
		"$@" --skip-networking --socket="${SOCKET}" &
		mysql_note "Waiting for server startup"
		local i
		for i in {30..0}; do
			extraArgs=()
			if [ -z "$DATABASE_ALREADY_EXISTS" ]; then
				extraArgs+=( '--dont-use-mysql-root-password' )
			fi
			if docker_process_sql "${extraArgs[@]}" --database=mysql <<<'SELECT 1' &> /dev/null; then
				break
			fi
			sleep 1
		done
		if [ "$i" = 0 ]; then
			mysql_error "Unable to start server."
		fi
	else
		if ! "$@" --daemonize --skip-networking --socket="${SOCKET}"; then
			mysql_error "Unable to start server."
		fi
	fi
}
docker_temp_server_stop() {
	if ! mysqladmin --defaults-extra-file=<( _mysql_passfile ) shutdown -uroot --socket="${SOCKET}"; then
		mysql_error "Unable to shut down server."
	fi
}
docker_verify_minimum_env() {
	if [ -z "$MYSQL_ROOT_PASSWORD" -a -z "$MYSQL_ALLOW_EMPTY_PASSWORD" -a -z "$MYSQL_RANDOM_ROOT_PASSWORD" ]; then
		mysql_error $'Database is uninitialized and password option is not specified\n\tYou need to specify one of MYSQL_ROOT_PASSWORD, MYSQL_ALLOW_EMPTY_PASSWORD and MYSQL_RANDOM_ROOT_PASSWORD'
	fi
}
docker_create_db_directories() {
	local user; user="$(id -u)"
	mkdir -p "$DATADIR"
	if [ "$user" = "0" ]; then
		find "$DATADIR" \! -user mysql -exec chown mysql '{}' +
	fi
}
docker_init_database_dir() {
	mysql_note "Initializing database files"
	if [ "$MYSQL_MAJOR" = '5.6' ]; then
		mysql_install_db --datadir="$DATADIR" --rpm --keep-my-cnf "${@:2}"
	else
		"$@" --initialize-insecure
	fi
	mysql_note "Database files initialized"
	if command -v mysql_ssl_rsa_setup > /dev/null && [ ! -e "$DATADIR/server-key.pem" ]; then
		mysql_note "Initializing certificates"
		mysql_ssl_rsa_setup --datadir="$DATADIR"
		mysql_note "Certificates initialized"
	fi
}
docker_setup_env() {
	declare -g DATADIR SOCKET
	DATADIR="$(mysql_get_config 'datadir' "$@")"
	SOCKET="$(mysql_get_config 'socket' "$@")"
	file_env 'MYSQL_ROOT_HOST' '%'
	file_env 'MYSQL_DATABASE'
	file_env 'MYSQL_USER'
	file_env 'MYSQL_PASSWORD'
	file_env 'MYSQL_ROOT_PASSWORD'
	declare -g DATABASE_ALREADY_EXISTS
	if [ -d "$DATADIR/mysql" ]; then
		DATABASE_ALREADY_EXISTS='true'
	fi
}
docker_process_sql() {
	passfileArgs=()
	if [ '--dont-use-mysql-root-password' = "$1" ]; then
		passfileArgs+=( "$1" )
		shift
	fi
	if [ -n "$MYSQL_DATABASE" ]; then
		set -- --database="$MYSQL_DATABASE" "$@"
	fi
	mysql --defaults-extra-file=<( _mysql_passfile "${passfileArgs[@]}") --protocol=socket -uroot -hlocalhost --socket="${SOCKET}" "$@"
}
docker_setup_db() {
	if [ -z "$MYSQL_INITDB_SKIP_TZINFO" ]; then
		mysql_tzinfo_to_sql /usr/share/zoneinfo \
			| sed 's/Local time zone must be set--see zic manual page/FCTY/' \
			| docker_process_sql --dont-use-mysql-root-password --database=mysql
	fi
	if [ -n "$MYSQL_RANDOM_ROOT_PASSWORD" ]; then
		export MYSQL_ROOT_PASSWORD="$(pwgen -1 32)"
		mysql_note "GENERATED ROOT PASSWORD: $MYSQL_ROOT_PASSWORD"
	fi
	local rootCreate=
	if [ -n "$MYSQL_ROOT_HOST" ] && [ "$MYSQL_ROOT_HOST" != 'localhost' ]; then
		read -r -d '' rootCreate <<-EOSQL || true
			CREATE USER 'root'@'${MYSQL_ROOT_HOST}' IDENTIFIED BY '${MYSQL_ROOT_PASSWORD}' ;
			GRANT ALL ON *.* TO 'root'@'${MYSQL_ROOT_HOST}' WITH GRANT OPTION ;
		EOSQL
	fi
	local passwordSet=
	if [ "$MYSQL_MAJOR" = '5.6' ]; then
		read -r -d '' passwordSet <<-EOSQL || true
			DELETE FROM mysql.user WHERE user NOT IN ('mysql.sys', 'mysqlxsys', 'root') OR host NOT IN ('localhost') ;
			SET PASSWORD FOR 'root'@'localhost'=PASSWORD('${MYSQL_ROOT_PASSWORD}') ;
			-- 5.5: https://github.com/mysql/mysql-server/blob/e48d775c6f066add457fa8cfb2ebc4d5ff0c7613/scripts/mysql_secure_installation.sh#L192-L210
			-- 5.6: https://github.com/mysql/mysql-server/blob/06bc670db0c0e45b3ea11409382a5c315961f682/scripts/mysql_secure_installation.sh#L218-L236
			-- 5.7: https://github.com/mysql/mysql-server/blob/913071c0b16cc03e703308250d795bc381627e37/client/mysql_secure_installation.cc#L792-L818
			-- 8.0: https://github.com/mysql/mysql-server/blob/b93c1661d689c8b7decc7563ba15f6ed140a4eb6/client/mysql_secure_installation.cc#L726-L749
			DELETE FROM mysql.db WHERE Db='test' OR Db='test\_%' ;
			-- https://github.com/docker-library/mysql/pull/479#issuecomment-414561272 ("This is only needed for 5.5 and 5.6")
		EOSQL
	else
		read -r -d '' passwordSet <<-EOSQL || true
			ALTER USER 'root'@'localhost' IDENTIFIED BY '${MYSQL_ROOT_PASSWORD}' ;
		EOSQL
	fi
	docker_process_sql --dont-use-mysql-root-password --database=mysql <<-EOSQL
		-- What's done in this file shouldn't be replicated
		--  or products like mysql-fabric won't work
		SET @@SESSION.SQL_LOG_BIN=0;
		${passwordSet}
		GRANT ALL ON *.* TO 'root'@'localhost' WITH GRANT OPTION ;
		FLUSH PRIVILEGES ;
		${rootCreate}
		DROP DATABASE IF EXISTS test ;
	EOSQL
	if [ -n "$MYSQL_DATABASE" ]; then
		mysql_note "Creating database ${MYSQL_DATABASE}"
		docker_process_sql --database=mysql <<<"CREATE DATABASE IF NOT EXISTS \`$MYSQL_DATABASE\` ;"
	fi
	if [ -n "$MYSQL_USER" ] && [ -n "$MYSQL_PASSWORD" ]; then
		mysql_note "Creating user ${MYSQL_USER}"
		docker_process_sql --database=mysql <<<"CREATE USER '$MYSQL_USER'@'%' IDENTIFIED BY '$MYSQL_PASSWORD' ;"
		if [ -n "$MYSQL_DATABASE" ]; then
			mysql_note "Giving user ${MYSQL_USER} access to schema ${MYSQL_DATABASE}"
			docker_process_sql --database=mysql <<<"GRANT ALL ON \`${MYSQL_DATABASE//_/\\_}\`.* TO '$MYSQL_USER'@'%' ;"
		fi
		docker_process_sql --database=mysql <<<"FLUSH PRIVILEGES ;"
	fi
}
_mysql_passfile() {
	if [ '--dont-use-mysql-root-password' != "$1" ] && [ -n "$MYSQL_ROOT_PASSWORD" ]; then
		cat <<-EOF
			[client]
			password="${MYSQL_ROOT_PASSWORD}"
		EOF
	fi
}
mysql_expire_root_user() {
	if [ -n "$MYSQL_ONETIME_PASSWORD" ]; then
		docker_process_sql --database=mysql <<-EOSQL
			ALTER USER 'root'@'%' PASSWORD EXPIRE;
		EOSQL
	fi
}
_mysql_want_help() {
	local arg
	for arg; do
		case "$arg" in
			-'?'|--help|--print-defaults|-V|--version)
				return 0
				;;
		esac
	done
	return 1
}
_main() {
	if [ "${1:0:1}" = '-' ]; then
		set -- mysqld "$@"
	fi
	if [ "$1" = 'mysqld' ] && ! _mysql_want_help "$@"; then
		mysql_note "Entrypoint script for MySQL Server ${MYSQL_VERSION} started."
		mysql_check_config "$@"
		docker_setup_env "$@"
		docker_create_db_directories
		if [ "$(id -u)" = "0" ]; then
			mysql_note "Switching to dedicated user 'mysql'"
			exec gosu mysql "$BASH_SOURCE" "$@"
		fi
		if [ -z "$DATABASE_ALREADY_EXISTS" ]; then
			docker_verify_minimum_env
			ls /docker-entrypoint-initdb.d/ > /dev/null
			docker_init_database_dir "$@"
			mysql_note "Starting temporary server"
			docker_temp_server_start "$@"
			mysql_note "Temporary server started."
			docker_setup_db
			docker_process_init_files /docker-entrypoint-initdb.d/*
			mysql_expire_root_user
			mysql_note "Stopping temporary server"
			docker_temp_server_stop
			mysql_note "Temporary server stopped"
			echo
			mysql_note "MySQL init process done. Ready for start up."
			echo
		fi
	fi
	exec "$@"
}
if ! _is_sourced; then
	_main "$@"
fi