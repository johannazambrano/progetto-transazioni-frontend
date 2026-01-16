FROM node:20.19-alpine
WORKDIR /app
# Installa solo le dipendenze
COPY package*.json ./
RUN npm install
# Copia il resto
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]