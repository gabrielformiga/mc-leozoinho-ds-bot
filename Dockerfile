FROM mhart/alpine-node:10

RUN mkdir -p /app
WORKDIR /app

RUN apk add --no-cache make gcc g++ python
RUN apk add --update ffmpeg

COPY package.json .
COPY yarn.lock .
RUN yarn install

COPY index.js .

CMD ["node", "index.js"]