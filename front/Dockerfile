# Use a Node.js runtime as a parent image
FROM node:14

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project to the container's working directory
COPY . .

# Build the Quasar PWA
RUN npm run build

# Install a simple static server to serve the built PWA
RUN npm install -g serve

# Change the working directory to the build output
WORKDIR /app/dist/pwa

# Expose the port the app runs on
EXPOSE 3000

# Run the static server to serve the built PWA
CMD ["serve", "-s", ".", "-l", "3000"]
