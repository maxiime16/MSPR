const express = require("express");
const advertisementsRoute = require("../routes/advertisements");
const request = require("supertest");

// Créer un mock pour la base de données
const mockDB = {
  all: jest.fn(),
  get: jest.fn(),
  run: jest.fn(),
  lastID: 42,
};

//Création des mocks
const mockAdvertissements = [
  {
    id: 0,
    title: "Rose",
    descriptions: "Rose rouge",
    user_id: 1,
    plant_id: 1,
    longitude: 45.123,
    latitude: 2.456,
    category_id: 1,
  },
  {
    id: 1,
    title: "Tulipe",
    descriptions: "Tulipe Blanche",
    user_id: 2,
    plant_id: 2,
    location: "Londre",
    longitude: 45.123,
    latitude: 2.456,
    category_id: 1,
  },
];

//Création de l'app
const app = express();
app.use(express.json());
app.use("/api/advertisements", advertisementsRoute(mockDB));

describe("Test de la route pour récupérer les annonce", () => {
  it("Devrait renvoyer un utilisateur existant au format JSON avec un code d'état 200", async () => {
    // Mock de la réponse de la base de données pour cet ensemble de tests
    mockDB.all.mockImplementation((query, callback) => {
      callback(null, mockAdvertissements);
    });

    const response = await request(app).get("/api/advertisements");

    expect(response.status).toBe(200);
    expect(response.type).toMatch(/json/);
    expect(response.body).toEqual(mockAdvertissements);
  });
  it("Devrait renvoyer une erreur 500 si une erreur survient lors de la récupération des utilisateurs", async () => {
    // Mock de la réponse de la base de données pour cet ensemble de tests
    mockDB.all.mockImplementation((query, callback) => {
      callback(
        "Une erreur s'est produite lors de la récupération des annonces."
      );
    });

    const response = await request(app).get("/api/advertisements");

    expect(response.status).toBe(500);
    expect(response.type).toMatch(/json/);
    expect(response.body).toEqual(
      "Une erreur s'est produite lors de la récupération des annonces."
    );
  });
});
describe("Test de la route pour récupérer une annonce ID", () => {
  it("Devrait renvoyer une annonce existente existant au format JSON avec un code d'état 200", async () => {
    // Mock de la réponse de la base de données pour cet ensemble de tests
    mockDB.get.mockImplementation((query, params, callback) => {
      callback(null, mockAdvertissements[1]);
    });

    const response = await request(app).get("/api/advertisements/1");

    expect(response.status).toBe(200);
    expect(response.type).toMatch(/json/);
    expect(response.body).toEqual(mockAdvertissements[1]);
  });
  it("Devrait renvoyer une erreur 500 si une erreur survient lors de la récupération des utilisateurs", async () => {
    // Mock de la réponse de la base de données pour cet ensemble de tests
    mockDB.get.mockImplementation((query, params, callback) => {
      callback(
        "Une erreur s'est produite lors de la récupération des annonces."
      );
    });

    const response = await request(app).get("/api/advertisements/1");

    expect(response.status).toBe(500);
    expect(response.type).toMatch(/json/);
    expect(response.body).toEqual(
      "Une erreur s'est produite lors de la récupération des annonces par id."
    );
  });
});
describe("Test de la route pour récupérer une anonce en fonction de sa category", () => {
  it("Devrait renvoyer une erreur 200 si la récupération a étais faite", async () => {
    // Mock de la réponse de la base de données pour cet ensemble de tests
    mockDB.all.mockImplementation((query, params, callback) => {
      callback(null, mockAdvertissements);
    });

    const response = await request(app).get("/api/advertisements/category/3");

    console.log(response.body);

    expect(response.status).toBe(200);
    expect(response.type).toMatch(/json/);
    expect(response.body).toEqual([
      mockAdvertissements[0],
      mockAdvertissements[1],
    ]);
  });
  it("Devrait renvoyer une erreur 500 si une erreur survient lors de la récupération des utilisateurs", async () => {
    // Mock de la réponse de la base de données pour cet ensemble de tests
    mockDB.all.mockImplementation((query, params, callback) => {
      callback(
        "Une erreur s'est produite lors de la récupération des annonces."
      );
    });

    const response = await request(app).get("/api/advertisements/category/3");

    expect(response.status).toBe(500);
    expect(response.type).toMatch(/json/);
    expect(response.body).toEqual({
      error:
        "Une erreur s'est produite lors de la récupération des annonces par id.",
    });
  });
});
describe("Test de la route pour mettre à jour une annonce par ID", () => {
  it("Devrait renvoyer un message de succès si la mise à jour est réussie", async () => {
    const updatedAdvertisement = {
      title: "Nouveau titre",
      description: "Nouvelle description",
      user_id: 3,
      plants_id: 4,
      longitude: 1.234,
      latitude: 2.345,
    };

    // Mock de la réponse de la base de données pour cet ensemble de tests
    mockDB.run.mockImplementation((query, params, callback) => {
      callback(null); // Aucune erreur, la mise à jour réussit
    });

    const response = await request(app)
      .put("/api/advertisements/1/update")
      .send(updatedAdvertisement);

    expect(response.status).toBe(200);
    expect(response.text).toContain("mise à jour avec succès");
  });

  it("Devrait renvoyer une erreur 500 si une erreur survient lors de la mise à jour", async () => {
    const updatedAdvertisement = {
      title: "Nouveau titre",
      description: "Nouvelle description",
      user_id: 3,
      longitude: 1.234,
      latitude: 2.345,
    };

    // Mock de la réponse de la base de données pour cet ensemble de tests
    mockDB.run.mockImplementation((query, params, callback) => {
      callback("Erreur de base de données"); // Simuler une erreur de base de données
    });

    const response = await request(app)
      .put("/api/advertisements/1/update")
      .send(updatedAdvertisement);

    expect(response.status).toBe(500);
    expect(response.text).toContain("Erreur lors de la mise à jour");
  });
});
describe("Test de la route pour créer une annonce", () => {
  it("Devrait renvoyer un message de création avec succès", async () => {
    const createdAdvertissement = {
      title: "Nouvelle Annonce De Test",
      description: "Voici la description de la nouvelle annonce",
      user_id: 1,
      longitude: 1.234,
      latitude: 2.345,
      category_id: 1,
      sub_category_id: 1,
    };

    mockDB.run.mockImplementation((query, params, callback) => {
      callback(null);
    });

    const response = await request(app)
      .post("/api/advertisements/create")
      .send(createdAdvertissement);

    console.log(response.text);

    expect(response.status).toBe(200);
    // Convertir la chaîne JSON en objet JavaScript
    const responseBody = JSON.parse(response.text);

    expect(responseBody).toEqual({
      message: "Annonce insérée avec succès.",
    });
  });
    it("Devrait renvoyer un message d'erreur lors de l'insertion", async () => {
      const createdAdvertissement = {
        title: "Nouvelle Annonce De Test",
        description: "Voici la description de la nouvelle annonce",
        user_id: 1,
        longitude: 1.234,
        latitude: 2.345,
        category_id: 1,
        sub_category_id: 1,
      };
  
      mockDB.run.mockImplementation((query, params, callback) => {
        callback(new Error("Erreur simulée lors de l'insertion"));
      });
  
      const response = await request(app)
        .post("/api/advertisements/create")
        .send(createdAdvertissement);
  
      console.log(response.text);
  
      expect(response.status).toBe(500);
  
      // Convertir la chaîne JSON en objet JavaScript
      const responseBody = JSON.parse(response.text);
  
      expect(responseBody).toEqual({
        error: "Erreur lors de l'insertion de l'annonce.",
        details: "Erreur simulée lors de l'insertion"
      });
    });
  });