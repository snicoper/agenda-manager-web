# Dockerfile para desarrollo

# Utilizamos la imagen oficial de Node.js
FROM node:20

# Establecemos el directorio de trabajo
WORKDIR /usr/src/app

# Copiamos los archivos package.json y package-lock.json
COPY package*.json ./

# Instalamos las dependencias
RUN npm install

# Copiamos el resto de los archivos del proyecto
COPY . .

# Exponemos el puerto 4200
EXPOSE 4200

# Comando para iniciar la aplicación en desarrollo
CMD ["npm", "start"]
