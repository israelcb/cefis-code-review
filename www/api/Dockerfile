FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install
RUN npm install -g @nestjs/cli

COPY . .

FROM node:20-alpine

COPY --from=builder /app ./

EXPOSE 3042

CMD ["npm", "run", "start:dev"]