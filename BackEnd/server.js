const express = require("express");
const sqlite3 = require("sqlite3");
const cors = require("cors");
const app = express();
const port = 3001;

// Connexion à la base de données SQLite
const db = new sqlite3.Database("arosaje.db");

app.use(
  express.json(),
  cors({
    origin: "http://localhost:5173",
  })
);

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Le serveur est en cours d'exécution sur le port ${port}`);
});

// Appel des routes
const usersRoutes = require("./routes/users")(db);
app.use("/api/users", usersRoutes);

const categoryRoutes = require("./routes/category")(db);
app.use("/api/category", categoryRoutes);

const sub_categoryRoutes = require("./routes/sub_category")(db);
app.use("/api", sub_categoryRoutes);

const advertisementsRoutes = require("./routes/advertisements")(db);
app.use("/api/advertisements", advertisementsRoutes);

const plantsRoutes = require("./routes/plant")(db);
app.use("/api/plants", plantsRoutes);

const advicesRoutes = require("./routes/advices")(db);
app.use("/api/", advicesRoutes);

const imagesRoutes = require("./routes/images")(db);
app.use("/api/images", imagesRoutes);



// Exporter l'application pour les tests
module.exports = app;
