FROM node:20-alpine

# Set working directory inside container
WORKDIR /app

# Copy package files first for efficient caching
COPY package*.json ./

# Install dependencies (production only)
RUN npm ci --omit=dev

# Copy the rest of the application code
COPY . .

# Set environment variable
ENV NODE_ENV=production

# Expose the port your app runs on
EXPOSE 5000

# Start the application
CMD ["node", "server.js"]
