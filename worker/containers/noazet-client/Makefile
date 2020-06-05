dev:
	npm start gulp-devtools

gulp:
	gulp-devtools

pre-prod:
	docker-compose up -d

stop:
	docker stop app

recompose:
	make stop
	docker-compose down
	docker-compose build --no-cache
	docker-compose up -d

build:
	rm -r build node_modules && docker build . -t louisl98/ts-trading-platform --no-cache

publish:
	docker push louisl98/ts-trading-platform

test-prod:
	docker run -it louisl98/ts-trading-platform

