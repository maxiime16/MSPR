# README back-end

## Avant de commencer
 - npm install

## run le serveur
 - node server.js

## run les tests
 - npx jest

## build l'image docker et la run
 - prérequis: avoir docker d'installer et d'ouvert
 - docker build -t backend_mspr .
 - docker run -d --name backend_mspr -p 3001:3001 backend_mspr

## Reinitialiser la base de donnée
- Supprimer 'arosaje.db'
- Commande: 'sqlite3 arosaje.db'
- Lancer le serveur