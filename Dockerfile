# Use a Node.js base image for building
FROM node:latest as build

# Set the working directory in the container
WORKDIR /app

# Copy your frontend application files to the container
COPY . .

# Install dependencies and build frontend
RUN npm install
RUN npm run build

# Use a lightweight Node.js image for serving the frontend
FROM node:alpine

# Set the working directory in the container
WORKDIR /app

# Copy the built frontend files from the previous stage
COPY --from=build /app/build ./build

# Expose the port
EXPOSE 3000

# Command to serve the frontend
CMD ["npx", "serve", "-s", "build"]