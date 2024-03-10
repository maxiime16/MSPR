const express = require("express");
const router = express.Router();

module.exports = (db) => {
  // Récupérer toutes les catégories
  router.get("/", (_, res) => {
    db.all("SELECT * FROM category", (err, rows) => {
      if (err) {
        console.error(err);
        res.status(500).json("Erreur lors de la récupération des catégories.");
      } else {
        res.json(rows);
      }
    });
  });

  // Récupérer une catégorie par id
  router.get("/:id", (req, res) => {
    const categId = req.params.id;

    db.get("SELECT * FROM category WHERE id = ?", [categId], (err, row) => {
      if (err) {
        console.error(err);
        res
          .status(500)
          .json(
            `Erreur lors de la récupération de l'utilisateur avec l'ID ${categId}.`
          );
      } else {
        if (row) {
          res.json(row);
        } else {
          res.status(404).json(`Utilisateur avec l'ID ${categId} non trouvé.`);
        }
      }
    });
  });

  return router;
};
