FROM alpine:3.11
LABEL author="louislaugier"
LABEL maintainer="louis@noazet.com"
LABEL version="1.0"
RUN addgroup -S -g 1000 redis && adduser -S -G redis -u 999 redis
RUN apk add --no-cache \
		'su-exec>=0.2' \
		tzdata
ENV REDIS_VERSION 6.0.3
RUN set -eux; \
	apk add --no-cache --virtual .build-deps \
		coreutils \
		gcc \
		linux-headers \
		make \
		musl-dev \
		openssl-dev \
	; \
	wget -O redis.tar.gz "http://download.redis.io/releases/redis-6.0.3.tar.gz"; \
	echo "bca46dce81fe92f7b2de4cf8ae41fbc4b94fbd5674def7f12c87e7f9165cbb3a *redis.tar.gz" | sha256sum -c -; \
	mkdir -p /usr/src/redis; \
	tar -xzf redis.tar.gz -C /usr/src/redis --strip-components=1; \
	rm redis.tar.gz; \
	grep -E '^ *createBoolConfig[(]"protected-mode",.*, *1 *,.*[)],$' /usr/src/redis/src/config.c; \
	sed -ri 's!^( *createBoolConfig[(]"protected-mode",.*, *)1( *,.*[)],)$!\10\2!' /usr/src/redis/src/config.c; \
	grep -E '^ *createBoolConfig[(]"protected-mode",.*, *0 *,.*[)],$' /usr/src/redis/src/config.c; \
	export BUILD_TLS=yes; \
	make -C /usr/src/redis -j "$(nproc)" all; \
	make -C /usr/src/redis install; \
	serverMd5="$(md5sum /usr/local/bin/redis-server | cut -d' ' -f1)"; export serverMd5; \
	find /usr/local/bin/redis* -maxdepth 0 \
		-type f -not -name redis-server \
		-exec sh -eux -c ' \
			md5="$(md5sum "$1" | cut -d" " -f1)"; \
			test "$md5" = "$serverMd5"; \
		' -- '{}' ';' \
		-exec ln -svfT 'redis-server' '{}' ';' \
	; \
	rm -r /usr/src/redis; \
	runDeps="$( \
		scanelf --needed --nobanner --format '%n#p' --recursive /usr/local \
			| tr ',' '\n' \
			| sort -u \
			| awk 'system("[ -e /usr/local/lib/" $1 " ]") == 0 { next } { print "so:" $1 }' \
	)"; \
	apk add --no-network --virtual .redis-rundeps $runDeps; \
	apk del --no-network .build-deps;
	# echo never > /sys/kernel/mm/transparent_hugepage/enabled \
	# echo never > /sys/kernel/mm/transparent_hugepage/defrag
	# vm.overcommit_memory = 1
RUN mkdir /data && chown redis:redis /data
VOLUME /data
WORKDIR /data
COPY docker-entrypoint.sh /usr/local/bin/
RUN ["chmod", "+x", "/usr/local/bin/docker-entrypoint.sh"]
ENTRYPOINT ["docker-entrypoint.sh"]
EXPOSE 6379
CMD ["redis-server"]
