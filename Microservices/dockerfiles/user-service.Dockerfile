# Use Node.js LTS as the base image
FROM node:20-alpine AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN if [ -f package-lock.json ]; then npm ci; else echo "package-lock.json not found; using npm install"; npm install; fi
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN if [ -f package-lock.json ]; then npm ci --omit=dev; else echo "package-lock.json not found; using npm install --omit=dev"; npm install --omit=dev; fi
COPY --from=builder /usr/src/app/dist ./dist
EXPOSE 3007
CMD ["node", "dist/main.js"]