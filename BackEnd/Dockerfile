
# Utilisation de l'image officielle Node.js
FROM node:20.10

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier le package.json et package-lock.json pour installer les dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers de l'application
COPY . .

# Exposer le port nécessaire par votre application
EXPOSE 3001

# Commande pour démarrer l'application
CMD ["node", "server.js"]
