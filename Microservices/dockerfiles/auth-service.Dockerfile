# Build stage: use Node 20 so dev tools (nest, typescript) are available
FROM node:20-alpine AS builder
WORKDIR /usr/src/app

# Copy package files and install all dependencies (including dev) for build
COPY package*.json ./
RUN npm ci

# Copy source and build the NestJS app
COPY . .
RUN npm run build

# Production stage: smaller image with only production deps
FROM node:20-alpine
WORKDIR /usr/src/app

# Copy package files and install only production deps
COPY package*.json ./
RUN npm ci --omit=dev

# Copy built artifacts from builder
COPY --from=builder /usr/src/app/dist ./dist

# Expose the port your app runs on (default NestJS port is 3001)
EXPOSE 3001

# Start the application
CMD ["node", "dist/main.js"]