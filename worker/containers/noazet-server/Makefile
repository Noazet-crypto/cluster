dev:
	mkdir -p store/mysql
	docker-compose up -d
	air .

stop:
	docker-compose stop

recompose:
	make stop
	docker-compose down
	rm -r store
	docker-compose build --no-cache
	mkdir -p store/{kafka,mysql,redis}
	docker-compose up -d --force-recreate

build:
	rm -r app && CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -a -installsuffix cgo -o app . && docker build . -t louisl98/go-trading-engine

publish:
	docker push louisl98/go-trading-engine

test-prod:
	docker run -it louisl98/go-trading-engine
