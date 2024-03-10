const express = require("express");
const router = express.Router();

module.exports = (db) => {
  // Récupération de tout les users
  router.get("/", (_, res) => {
    db.all("SELECT * FROM users", (err, rows) => {
      if (err) {
        return res
          .status(500)
          .json(
            "Une erreur s'est produite lors de la récupération des utilisateurs."
          );
      }
      res.json(rows);
    });
  });

  // Récupérer un utilisateur par ID
  router.get("/:id", (req, res) => {
    const userId = req.params.id;

    db.get("SELECT * FROM users WHERE id = ?", [userId], (err, row) => {
      if (err) {
        return res.status(500).json({
          error:
            "Une erreur s'est produite lors de la récupération de l'utilisateur.",
        });
      }
      if (!row) {
        return res
          .status(404)
          .json({ error: `Utilisateur avec l'ID ${userId} non trouvé.` });
      }
      res.json(row);
    });
  });

  // Ajout d'un utilisateur
  router.post("/", (req, res) => {
    const { first_name, last_name, email, password } = req.body;

    // Vérification si l'e-mail existe déjà dans la base de données
    db.get(
      "SELECT * FROM Users WHERE email = ?",
      [email],
      (err, existingUser) => {
        if (err) {
          return res.status(500).json({
            error:
              "Une erreur s'est produite lors de la vérification de l'e-mail.",
          });
        }

        if (existingUser) {
          return res
            .status(400)
            .json({ error: "Un compte avec cet e-mail existe déjà." });
        }

        // Si l'e-mail n'existe pas déjà, procéder à l'ajout de l'utilisateur
        db.run(
          "INSERT INTO Users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)",
          [first_name, last_name, email, password],
          function (err) {
            if (err) {
              return res.status(500).json({
                error:
                  "Une erreur s'est produite lors de l'ajout de l'utilisateur.",
              });
            }
            res.status(200).json({
              id: this.lastID,
              first_name,
              last_name,
              email,
            });
          }
        );
      }
    );
  });

  //check login/mdp
  router.get("/log_infos/:email", (req, res) => {
    const email = req.params.email;

    db.all(
      "SELECT email, password, first_name, last_name, id FROM users WHERE email = ?",
      [email],
      (err, rows) => {
        if (err) {
          return res.status(500).json({
            error:
              "Une erreur s'est produite lors de la récupération des utilisateurs.",
          });
        }
        res.json(rows);
      }
    );
  });

  // Suppression d'un utilisateur par ID
  router.delete("/:id", (req, res) => {
    const userId = req.params.id;

    db.run("DELETE FROM Users WHERE id = ?", [userId], function (err) {
      if (err) {
        return res.status(500).json({
          error:
            "Une erreur s'est produite lors de la suppression de l'utilisateur.",
        });
      }
      if (this.changes === 0) {
        return res
          .status(404)
          .json({ error: `Utilisateur avec l'ID ${userId} non trouvé.` });
      }
      res.json({
        message: `Utilisateur avec l'ID ${userId} supprimé avec succès.`,
      });
    });
  });

  return router;
};
