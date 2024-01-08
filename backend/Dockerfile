##############
# for BUILD
##############
FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json yarn.lock ./

RUN yarn global add @nestjs/cli
RUN yarn install --frozen-lockfile

COPY . .

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

RUN yarn prisma generate

RUN yarn run build

##############
# for RUN
##############
FROM node:18-alpine

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY --from=0 /usr/src/app/dist ./dist
COPY --from=0 /usr/src/app/node_modules ./node_modules

# 環境変数の合成
# CDKでDATABASE_URLを動的に生成することができないため、実行時に生成されるよう.envを調整する
RUN echo 'DATABASE_URL=postgresql://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?schema=public' > .env

USER node

CMD ["node", "dist/src/main.js"]