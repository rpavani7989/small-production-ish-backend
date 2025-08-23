# Use Node.js LTS (small base image)
FROM node:18-slim

# Set working directory inside container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first for caching
COPY package*.json ./

# Install only production dependencies
RUN npm install --production

# Copy the rest of your backend source code
COPY . .

# Expose the port (Railway will map its PORT env to this)
EXPOSE 5000

# Start the server
CMD ["npm", "start"]
