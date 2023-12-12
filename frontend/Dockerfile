# Step 1: Build the application
FROM node:16-alpine as build-stage

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the project files into the container at /app
COPY . .

# Build the app
RUN npm run build

# Step 2: Serve the application from Nginx
FROM nginx:stable-alpine as production-stage

# Copy the built assets from the build stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY ./config/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 to the outside
EXPOSE 80

# When the container starts, start Nginx server
CMD ["nginx", "-g", "daemon off;"]
