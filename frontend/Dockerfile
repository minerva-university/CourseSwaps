# Step 1: Build the application
FROM node:16-alpine as build-stage

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Step 2: Serve the application from Nginx
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY ./config/nginx.conf /etc/nginx/conf.d/default.conf

# Copy the initialization script
COPY init-config.sh /init-config.sh
RUN chmod +x /init-config.sh

EXPOSE 80 443

ENTRYPOINT ["/init-config.sh"]
