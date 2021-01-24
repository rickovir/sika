FROM node:10 AS builder
WORKDIR /app
COPY ./package.json ./
RUN npm install

RUN npm uninstall bcryptjs

RUN npm install bcryptjs

COPY . .
RUN npm run build


FROM node:10-alpine
WORKDIR /app
COPY --from=builder /app ./
CMD ["npm", "run", "start:prod"]