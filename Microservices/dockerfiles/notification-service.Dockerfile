# Use Node.js LTS as the base image
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package.json package-lock.json* ./
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Build the NestJS app
RUN npm run build

# Expose the port your app runs on (default NestJS port is 3001)
EXPOSE 3005

# Start the application
CMD ["node", "dist/main.js"]