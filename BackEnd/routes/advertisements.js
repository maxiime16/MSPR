const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.get("/", (_, res) => {
    db.all("SELECT * FROM advertisements", (err, rows) => {
      if (err) {
        console.error(err);
        res
          .status(500)
          .json(
            "Une erreur s'est produite lors de la récupération des annonces."
          );
      } else {
        res.json(rows);
      }
    });
  });

  // Récupérer une annonce par ID
  router.get("/:id", (req, res) => {
    const advertisementsId = req.params.id;

    db.get(
      "SELECT * FROM Advertisements WHERE id = ?",
      [advertisementsId],
      (err, row) => {
        if (err) {
          return res
            .status(500)
            .json(
              "Une erreur s'est produite lors de la récupération des annonces par id."
            );
        }
        if (!row) {
          return res.status(404).json({
            error: `Utilisateur avec l'ID ${advertisementsId} non trouvé.`,
          });
        }
        res.json(row);
      }
    );
  });

  router.post("/create", (req, res) => {
    const { title, description, user_id, longitude, latitude, category_id, sub_category_id, start_date, end_date, city, postal_code } = req.body;
    db.run(
      "INSERT INTO Advertisements (title, description, user_id, longitude, latitude, category_id, sub_category_id, start_date, end_date, city, postal_code) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [title, description, user_id, longitude, latitude, category_id, sub_category_id, start_date, end_date, city, postal_code],
      function (err) {
        if (err) {
          console.error(err);
          res.status(500).json({"details": "Erreur simulée lors de l'insertion", "error": "Erreur lors de l'insertion de l'annonce."});
        } else {
          // Renvoyer l'ID de la nouvelle annonce insérée
          res.json({
            id: this.lastID,
            message: "Annonce insérée avec succès.",
          });
        }
      }
    );
  });

  // Mettre à jour une l'annonce par ID
  router.put("/:id/update", (req, res) => {
    const advertisementsId = req.params.id;
    const { title, description, user_id, plants_id, location } = req.body;

    db.run(
      "UPDATE advertisements SET title = ?, description = ?, user_id = ?, plants_id = ?, location = ? WHERE id = ?",
      [title, description, user_id, plants_id, location, advertisementsId],
      (err) => {
        if (err) {
          console.error(err);
          res
            .status(500)
            .json(
              `Erreur lors de la mise à jour de la plante avec l'ID ${advertisementsId}.`
            );
        } else {
          res
            .status(200)
            .json(
              `Plante avec l'ID ${advertisementsId} mise à jour avec succès.`
            );
        }
      }
    );
  });

  // Route pour récupérer les annonces en fonction de la catégorie
  router.get("/category/:categoryId", (req, res) => {
    const categoryId = req.params.categoryId;
    db.all(
      `SELECT * FROM Advertisements WHERE category_id = ?;`,
      [categoryId],
      (err, rows) => {
        if (err) {
          console.error(err);
          res.status(500).json({"error": "Une erreur s'est produite lors de la récupération des annonces par id."});
        } else {
          res.json(rows);
        }
      }
    );
  });

return router;
};
