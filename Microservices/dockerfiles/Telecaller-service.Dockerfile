FROM node:18-alpine AS builder
WORKDIR /app
COPY Telecaller-service/package*.json ./
RUN npm install
COPY Telecaller-service/ .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
EXPOSE 3006
CMD ["node", "dist/main.js"]
