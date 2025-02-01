# Use official Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Copy frontend files
COPY . .

# Install dependencies
RUN npm install

# Expose frontend port
EXPOSE 3000

# Start Next.js app
CMD ["npm", "run", "dev"]
