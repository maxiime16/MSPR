const request = require("supertest");
const express = require("express");
const usersRoute = require("../routes/users");

// Créer un mock pour la base de données
const mockDB = {
  get: jest.fn(),
  all: jest.fn(),
  run: jest.fn(),
};

// Mock de la réponse de la base de données pour cet ensemble de tests
const mockUsers = [
  { id: 1, name: "John Doe", email: "john@example.com" },
  { id: 2, name: "Jane Doe", email: "jane@example.com" }
];

// Créer une application express pour les tests
const app = express();
app.use(express.json());
app.use("/api/users", usersRoute(mockDB));

describe("Test de la route pour récupérer un utilisateur par ID", () => {
  it("Devrait renvoyer un utilisateur existant au format JSON avec un code d'état 200", async () => {
    // Mock de la réponse de la base de données pour cet ensemble de tests
    mockDB.get.mockImplementation((query, params, callback) => {
      callback(null, mockUsers[0]);
    });

    const response = await request(app).get("/api/users/1");

    expect(response.status).toBe(200);
    expect(response.type).toMatch(/json/);
    expect(response.body).toEqual(mockUsers[0]);
  });

  it("Devrait renvoyer une erreur 404 si l'utilisateur n'est pas trouvé", async () => {
    // Mock de la réponse de la base de données pour cet ensemble de tests
    mockDB.get.mockImplementation((query, params, callback) => {
      callback(null, null); // Simuler qu'aucun utilisateur n'a été trouvé
    });

    const response = await request(app).get("/api/users/999");

    expect(response.status).toBe(404);
    expect(response.type).toMatch(/json/);
    expect(response.body).toEqual({ error: "Utilisateur avec l'ID 999 non trouvé." });
  });

  it("Devrait renvoyer une erreur 500 si une erreur survient lors de la recherche de l'utilisateur", async () => {
    // Mock de la réponse de la base de données pour cet ensemble de tests
    mockDB.get.mockImplementation((query, params, callback) => {
      callback(new Error("Erreur de base de données")); // Simuler une erreur de base de données
    });

    const response = await request(app).get("/api/users/1");

    expect(response.status).toBe(500);
    expect(response.type).toMatch(/json/);
    expect(response.body).toEqual({ error: "Une erreur s'est produite lors de la récupération de l'utilisateur." });
  });
});

describe("Test de la route pour récupérer tous les utilisateurs", () => {
  it("Devrait renvoyer tous les utilisateurs au format JSON avec un code d'état 200", async () => {
    // Mock de la réponse de la base de données pour cet ensemble de tests
    mockDB.all.mockImplementation((query, callback) => {
      callback(null, mockUsers);
    });

    const response = await request(app).get("/api/users");

    expect(response.status).toBe(200);
    expect(response.type).toMatch(/json/);
    expect(response.body).toEqual(mockUsers);
  });

  it("Devrait renvoyer une erreur 500 si une erreur survient lors de la récupération des utilisateurs", async () => {
    // Mock de la réponse de la base de données pour cet ensemble de tests
    mockDB.all.mockImplementation((query, callback) => {
      callback(new Error("Erreur de base de données")); // Simuler une erreur de base de données
    });

    const response = await request(app).get("/api/users");

    expect(response.status).toBe(500);
    expect(response.type).toMatch(/json/);
    expect(response.body).toEqual("Une erreur s'est produite lors de la récupération des utilisateurs.");
  });
});
