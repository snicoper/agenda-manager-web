FROM node:20 as builder

WORKDIR /app

COPY package*.json ./
RUN npm install
RUN command -v ng || npm install -g @angular/cli

COPY . .
RUN npm run build -- --configuration=production

# Nginx stage
FROM nginx:alpine

# Copiar la configuración personalizada de nginx
COPY docker/dev/nginx.conf /etc/nginx/conf.d/default.conf

# Copiar los archivos compilados de Angular
COPY --from=builder /app/dist/agenda-manager-web/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
