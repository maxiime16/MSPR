const express = require("express");
const router = express.Router();
const fs = require('fs');

module.exports = (db) => {
  // Récupérer la première image par advertisement_id
  router.get("/:advertisementId", (req, res) => {
  const advertisementId = req.params.advertisementId;

  db.get(
    "SELECT id, image FROM images WHERE advertisement_id = ? LIMIT 1",
    [advertisementId],
    (err, row) => {
      if (err) {
        console.error(err);
        res.status(500).json("Erreur lors de la récupération de l'image.");
      } else {
        if (row) {
          // Envoyer les données de l'image en tant que réponse
          res.json(row);
        } else {
          res.status(404).json(`Aucune image trouvée pour l'annonce avec l'ID ${advertisementId}.`);
        }
      }
    }
  );
});

// Récupérer toutes les images par advertisement_id
router.get("/all/:advertisementId", (req, res) => {
  const advertisementId = req.params.advertisementId;

  db.all(
    "SELECT id, image FROM images WHERE advertisement_id = ?",
    [advertisementId],
    (err, rows) => {
      if (err) {
        console.error(err);
        res.status(500).json("Erreur lors de la récupération des images.");
      } else {
        if (rows.length > 0) {
          // Envoyer les données de toutes les images en tant que réponse
          res.json(rows);
        } else {
          res.status(404).json(`Aucune image trouvée pour l'annonce avec l'ID ${advertisementId}.`);
        }
      }
    }
  );
});


// Ajouter une image à une annonce
router.post("/upload/:advertisementId", (req, res) => {
  const advertisementId = req.params.advertisementId;

  // Récupérer les données de l'image à partir du corps de la requête
  const { image } = req.body;

  try {
    // Insérer les données de l'image dans la base de données
    db.run("INSERT INTO images (advertisement_id, image) VALUES (?, ?)", [advertisementId, image], function(err) {
      if (err) {
        console.error(err);
        res.status(500).json("Erreur lors de l'insertion de l'image dans la base de données.");
      } else {
        res.status(201).json("Image ajoutée avec succès.");
      }
    });
  } catch (error) {
    console.error("Erreur lors de l'enregistrement de l'image :", error);
    res.status(500).json("Erreur lors de l'enregistrement de l'image.");
  }
});

  // Supprimer une image
  router.delete("/:imageId", (req, res) => {
    const imageId = req.params.imageId;

    // Récupérer le chemin de l'image à partir de la base de données
    db.get("SELECT image FROM images WHERE id = ?", [imageId], (err, row) => {
      if (err) {
        console.error(err);
        res.status(500).json("Erreur lors de la récupération du chemin de l'image.");
      } else {
        if (row) {
          const imagePath = row.image;
          // Supprimer le fichier d'image du système de fichiers
          fs.unlink(imagePath, (err) => {
            if (err) {
              console.error(err);
              res.status(500).json("Erreur lors de la suppression de l'image.");
            } else {
              // Supprimer l'entrée de l'image de la base de données
              db.run("DELETE FROM images WHERE id = ?", [imageId], (err) => {
                if (err) {
                  console.error(err);
                  res.status(500).json("Erreur lors de la suppression de l'entrée de l'image de la base de données.");
                } else {
                  res.status(200).json("Image supprimée avec succès.");
                }
              });
            }
          });
        } else {
          res.status(404).json(`Image avec l'ID ${imageId} non trouvée.`);
        }
      }
    });
  });

  return router;
};
