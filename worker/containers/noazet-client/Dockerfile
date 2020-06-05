FROM node:10.20.1-alpine3.11
LABEL author="louislaugier"
LABEL maintainer="louis@noazet.com"
LABEL version="1.0"
WORKDIR /app
ADD gulp src gulpfile.js package.json tsconfig.json app/
RUN npm i -g gulp && npm i
CMD npm run build
