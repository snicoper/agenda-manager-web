# Dockerfile para producción

# Utilizamos la imagen oficial de Node.js
FROM node:20 AS builder

# Establecemos el directorio de trabajo
WORKDIR /usr/src/app

# Copiamos los archivos package.json y package-lock.json
COPY package*.json ./

# Instalamos las dependencias
RUN npm install

# Copiamos el resto de los archivos del proyecto
COPY . .

# Construimos la aplicación de Angular
RUN npm run build --prod

# Nginx para servir la aplicación
FROM nginx:alpine

# Copiamos los archivos de construcción desde el contenedor anterior
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html

# Copiamos el archivo de configuración de nginx
COPY ./docker/prod/nginx.conf /etc/nginx/nginx.conf

# Exponemos el puerto 80
EXPOSE 80

# Comando para iniciar nginx
CMD ["nginx", "-g", "daemon off;"]
