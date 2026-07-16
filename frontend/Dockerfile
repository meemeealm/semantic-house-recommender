# Use Node alpine for a small image size
FROM node:20-alpine

WORKDIR /app

# Copy package files first
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend source code
COPY . .

# Expose Vite's default dev server port
EXPOSE 3000

# Start Vite in development mode (pointing to port 3000)
CMD ["npm", "run", "dev", "--", "--host"]