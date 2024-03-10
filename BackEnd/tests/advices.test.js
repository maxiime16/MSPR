const express = require("express");
const advicesRoute = require("../routes/advices");
const request = require("supertest");

// Créer un mock pour la base de données
const mockDB = {
  all: jest.fn(),
  get: jest.fn(),
  run: jest.fn(),
  lastID: 42,
};

//Création des mocks
const mockAdvice = [
  {
    id: 1,
    advertisements_id:1,
    user_id:1,
    advice:"Conseil pour l'article 1",
  },
  {
    id: 2,
    advertisements_id:2,
    user_id:2,
    advice:"Conseil pour l'article 2",
  },
];

//Création de l'app
const app = express();
app.use(express.json());
app.use("/api/advices", advicesRoute(mockDB));

describe("Test de la route pour récupérer les conseils ", () => {
  it("Devrait renvoyer un utilisateur existant au format JSON avec un code d'état 200", async () => {
    // Mock de la réponse de la base de données pour cet ensemble de tests
    mockDB.all.mockImplementation((query, callback) => {
      callback(null, mockAdvice);
    });

    const response = await request(app).get("/api/advices");

    expect(response.status).toBe(200);
    expect(response.type).toMatch(/json/);
    expect(response.body).toEqual(mockAdvice);
  });
  it("Devrait renvoyer une erreur 500 si une erreur survient lors de la récupération des utilisateurs", async () => {
    // Mock de la réponse de la base de données pour cet ensemble de tests
    mockDB.all.mockImplementation((query, callback) => {
      callback(
        "Une erreur s'est produite lors de la récupération des annonces."
      );
    });

    const response = await request(app).get("/api/advices");

    expect(response.status).toBe(500);
    console.log(response.body);
    expect(response.type).toMatch(/json/);
    expect(response.body).toEqual({
      error: "Erreur lors de la récupération des conseils.",
    });
  });
});
describe("Test de la route pour récupérer une annonce ID", () => {
  it("Devrait renvoyer une annonce existente existant au format JSON avec un code d'état 200", async () => {
    // Mock de la réponse de la base de données pour cet ensemble de tests
    mockDB.get.mockImplementation((query, params, callback) => {
      callback(null, mockAdvice[1]);
    });

    const response = await request(app).get("/api/advices/1");

    expect(response.status).toBe(200);
    expect(response.type).toMatch(/json/);
    expect(response.body).toEqual(mockAdvice[1]);
  });
  it("Devrait renvoyer une erreur 500 si une erreur survient lors de la récupération des utilisateurs", async () => {
    // Mock de la réponse de la base de données pour cet ensemble de tests
    mockDB.get.mockImplementation((query, params, callback) => {
      callback(
        "Une erreur s'est produite lors de la récupération des annonces."
      );
    });

    const response = await request(app).get("/api/advices/1");

    expect(response.status).toBe(500);
    console.log(response.body);
    expect(response.type).toMatch(/json/);
    expect(response.body).toEqual({
      error:
        "Une erreur s'est produite lors de la récupération des annonces par id.",
    });
  });
});
describe("Test de la route pour récupérer un conseil par annonce", () => {
  it("Devrait renvoyer une annonce existente existant au format JSON avec un code d'état 200", async () => {
    // Mock de la réponse de la base de données pour cet ensemble de tests
    mockDB.all.mockImplementation((query, params, callback) => {
      callback(null,mockAdvice[1],mockAdvice[2]);
    });

    const response = await request(app).get("/api/advices/advertisement/1");

    expect(response.status).toBe(200);
    expect(response.type).toMatch(/json/);
    expect(response.body).toEqual(mockAdvice[1],mockAdvice[2]);
  });
  it("Devrait renvoyer une annonce existente existant au format JSON avec un code d'état 500", async () => {
    // Mock de la réponse de la base de données pour cet ensemble de tests
    mockDB.all.mockImplementation((query, params, callback) => {
      callback("Erreur lors de la récupération");
    });

    const response = await request(app).get("/api/advices/advertisement/1");

    expect(response.status).toBe(500);
    expect(response.type).toMatch(/json/);
    expect(response.body).toEqual("Erreur lors de la récupération des conseils.");
  });
});