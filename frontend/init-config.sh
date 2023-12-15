#!/bin/sh
echo "GOOGLE_CLIENT_ID: ${GOOGLE_CLIENT_ID}"
# Replace the placeholder in the built files
sed -i "s|default_client_id|${GOOGLE_CLIENT_ID}|g" /usr/share/nginx/html/js/*.js

# Start Nginx
exec nginx -g 'daemon off;'
