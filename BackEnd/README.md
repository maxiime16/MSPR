# README back-end

## Personnes qui ont fait le back-end
- Enzo De Sousa
- Maxime Devillepoix

## Info application back-end
- Back-end en Nodejs
- Utilisation d'une base de donnée SQLite

## Install requis
```
npm install sqlite3 cors
```
## Run le serveur
- node server.js

## Reinitialiser la base de donnée
- Supprimer 'arosaje.db'
- Commande: 'sqlite3 arosaje.db aides/BDD/arosaje.sql'
- Lancer le serveur

## Partie tests
- npm install --save-dev jest supertest
- npm install jest-mock-extended


npx jest
