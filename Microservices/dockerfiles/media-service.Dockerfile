# Use Node.js LTS as the base image
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Production image
FROM node:20-alpine

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Copy build output
COPY --from=builder /usr/src/app/dist ./dist

# Copy .env file into the container (important!)
COPY .env .env

# Expose port
EXPOSE 3004

# Run the app
CMD ["node", "dist/main.js"]
