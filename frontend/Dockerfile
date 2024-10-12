# Usar una imagen base de Node.js para construir la aplicación de React
FROM node:18

# Establecer el directorio de trabajo en el contenedor
WORKDIR /app

# Copiar los archivos del frontend al contenedor
COPY ./frontend /app

# Instalar las dependencias de Node.js
RUN npm install

# Exponer el puerto que será utilizado por React (default 3000)
EXPOSE 3000

# Comando para servir la aplicación de React
CMD ["npm", "start"]
