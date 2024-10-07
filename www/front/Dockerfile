FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install
RUN npm install -g next

COPY . .

FROM node:20-alpine

COPY --from=builder /app ./

EXPOSE 3000

CMD ["npm", "run", "dev"]