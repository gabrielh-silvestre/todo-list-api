FROM node:16-alpine as installer

WORKDIR /app

COPY package*.json ./

RUN npm ci


FROM node:16-alpine as builder

WORKDIR /app

COPY --from=installer /app/node_modules ./node_modules
COPY . .

RUN npx prisma generate
RUN npm run build


FROM node:16-alpine as runner

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist .

EXPOSE ${PORT}

CMD ["node", "server.js"]
