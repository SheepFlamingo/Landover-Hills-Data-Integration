# --- Build Stage ---
FROM node:18 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# --- Serve Stage ---
FROM nginx:alpine
# Copy the built React app to Nginx's public folder
COPY --from=build /app/build /usr/share/nginx/html
# Nginx will run on port 80 inside the container
EXPOSE 80
