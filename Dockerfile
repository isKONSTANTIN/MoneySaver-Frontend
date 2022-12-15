FROM node:latest

MAINTAINER isKONSTANTIN <me@knst.su>

ENV TZ=Europe/Moscow

EXPOSE 3000

WORKDIR /ms

COPY .nuxt ./.nuxt
COPY static ./static
COPY package.json ./package.json
COPY nuxt.config.js ./nuxt.config.js
COPY start.sh ./start.sh

ENTRYPOINT ["./start.sh"]
