const express = require("express");
const categoryRoute = require("../routes/category");
const request = require("supertest");

// Créer un mock pour la base de données
const mockDB = {
  all: jest.fn(),
  get: jest.fn(),
  run: jest.fn(),
};

// Correction de la définition de mockCategory comme un tableau
const mockCategory = [{
  id: 1,
  name: "Arbres"
}];

// Création de l'app
const app = express();
app.use(express.json());
app.use("/api/category", categoryRoute(mockDB));

describe("Test pour récupérer toutes les catégories", () => {
  it("Test de la réussite de la récupération code 200", async () => {
    mockDB.all.mockImplementation((query, callback) => {
      callback(null, mockCategory);
    });

    const response = await request(app).get("/api/category");

    expect(response.status).toBe(200);
    expect(response.type).toMatch(/json/);
    expect(response.body).toEqual(mockCategory);
  });

  it("Devrait renvoyer une erreur 500 si une erreur survient lors de la récupération des utilisateurs", async () => {
    // Mock de la réponse de la base de données pour cet ensemble de tests
    mockDB.all.mockImplementation((query, callback) => {
      callback("Une erreur s'est produite lors de la récupération des catégories.");
    });

    const response = await request(app).get("/api/category");

    expect(response.status).toBe(500);
    expect(response.type).toMatch(/json/);
    expect(response.body).toEqual({
      error: "Erreur lors de la récupération des catégories."
    });
  });
});

describe("Test de la route pour récupérer une annonce ID", () => {
  it("Devrait renvoyer une annonce existante au format JSON avec un code d'état 200", async () => {
    // Mock de la réponse de la base de données pour cet ensemble de tests
    mockDB.get.mockImplementation((query, params, callback) => {
      callback(null, mockCategory[0]);
    });

    const response = await request(app).get("/api/category/1");

    expect(response.status).toBe(200);
    expect(response.type).toMatch(/json/);
    expect(response.body).toEqual(mockCategory[0]);
  });

  it("Devrait renvoyer une erreur 500 si une erreur survient lors de la récupération des categorie", async () => {
    // Mock de la réponse de la base de données pour cet ensemble de tests
    mockDB.get.mockImplementation((query, params, callback) => {
      callback("Une erreur s'est produite lors de la récupération des annonces.");
    });

    const response = await request(app).get("/api/category/1");

    expect(response.status).toBe(500);
    expect(response.type).toMatch(/json/);
    expect(response.body).toEqual(
      "Erreur lors de la récupération de l'utilisateur avec cette id."
    );
  });

  it("Devrait renvoyer une erreur 404 si une erreur survient lors de la récupération des utilisateurs", async () => {
    // Mock de la réponse de la base de données pour cet ensemble de tests
    mockDB.get.mockImplementation((query, params, callback) => {
      callback(null,null);
    });
  
    const response = await request(app).get("/api/category/1");
  
    expect(response.status).toBe(404);
    expect(response.type).toMatch(/json/);
    expect(response.body).toEqual(
      "Erreur la categorie est introuvable"
    );
  });
  
});
