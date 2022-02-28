FROM node:12.18.1

MAINTAINER isKONSTANTIN <me@knst.su>

ENV TZ=Europe/Moscow

EXPOSE 3000

WORKDIR /ms

COPY nuxt ./.nuxt
COPY static ./static
COPY package.json ./package.json
COPY start.sh ./start.sh
COPY nuxt.config.js ./nuxt.config.js

ENTRYPOINT ["./start.sh"]
