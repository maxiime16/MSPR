const express = require("express");
const router = express.Router();

module.exports = (db) => {
  // Récupérer tout les conseils
  router.get("/", (_, res) => {
    db.all("SELECT * FROM advice", (err, rows) => {
      if (err) {
        console.error(err);
        res
          .status(500)
          .json({ error: "Erreur lors de la récupération des conseils." });
      } else {
        res.json(rows);
      }
    });
  });

  // Récupérer un conseil par ID
  router.get("/:id", (req, res) => {
    const adviceId = req.params.id;

    db.get("SELECT * FROM advice WHERE id = ?", [adviceId], (err, row) => {
      if (err) {
        console.error(err);
        res
          .status(500)
          .json({
            error:
              "Une erreur s'est produite lors de la récupération des annonces par id.",
          });
      } else {
        if (row) {
          res.json(row);
        } else {
          res.status(404).json(`Plante avec l'ID ${adviceId} non trouvée.`);
        }
      }
    });
  });

  // Récupérer les conseils pour une annonce spécifique
  router.get("/advertisement/:id", (req, res) => {
    const advertisementId = req.params.id;
    db.all(
      "SELECT Advice.*, Users.first_name, Users.last_name FROM Advice INNER JOIN Users ON Advice.user_id = Users.id WHERE Advice.advertisement_id = ?",
      [advertisementId],
      (err, rows) => {
        if (err) {
          res
            .status(500).json(`Erreur lors de la récupération des conseils.`);
        } else {
          res.status(200).json(rows);
        }
      }
    );
  });

  // Ajouter un nouveau conseil
  router.post("/create", (req, res) => {
    const { advertisement_id, user_id, advice } = req.body;

    // Vérifier que les données requises sont fournies
    if (!advertisement_id || !user_id || !advice) {
      return res
        .status(400)
        .json({ message: "Toutes les données sont requises" });
    }

    // Insérer le nouveau conseil dans la base de données
    const insertQuery = `
      INSERT INTO Advice (advertisement_id, user_id, advice)
      VALUES (?, ?, ?)
    `;
    db.run(insertQuery, [advertisement_id, user_id, advice], (err) => {
      if (err) {
        console.error("Erreur lors de l'ajout du conseil :", err);
        res.status(500).json({ message: "Erreur lors de l'ajout du conseil" });
      } else {
        res.status(201).json({ message: "Conseil ajouté avec succès" });
      }
    });
  });

  return router;
};
