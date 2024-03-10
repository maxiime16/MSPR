-- Table Users
CREATE TABLE Users (
    id INTEGER PRIMARY KEY,
    first_name TEXT,
    last_name TEXT,
    email TEXT,
    password TEXT,
    address_city TEXT,
    address_postal_code TEXT,
    address_street TEXT
);

-- Table Category
CREATE TABLE Category (
    id INTEGER PRIMARY KEY,
    name TEXT
);

-- Table Sub_category
CREATE TABLE Sub_category (
    id INTEGER PRIMARY KEY,
    name TEXT,
    category_id INTEGER,
    FOREIGN KEY (category_id) REFERENCES Category(id)
);

-- Table Advertisements
CREATE TABLE Advertisements (
    id INTEGER PRIMARY KEY,
    title TEXT,
    description TEXT,
    user_id INTEGER,
    longitude TEXT,
    latitude REAL,
    category_id INTEGER,
    sub_category_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (category_id) REFERENCES Category(id),
    FOREIGN KEY (sub_category_id) REFERENCES Sub_Category(id)
);

-- Table images
CREATE TABLE images (
    id INTEGER PRIMARY KEY,
    advertisement_id INTEGER,
    image BLOB,
    FOREIGN KEY (advertisement_id) REFERENCES Advertisements(id)
);

-- Table Advice
CREATE TABLE Advice (
    id INTEGER PRIMARY KEY,
    advertisement_id INTEGER,
    user_id INTEGER,
    advice TEXT,
    FOREIGN KEY (advertisement_id) REFERENCES Advertisements(id),
    FOREIGN KEY (user_id) REFERENCES Users(id)
);

-- Ajouter les catégories
INSERT INTO Category (name) VALUES ('Arbres');
INSERT INTO Category (name) VALUES ('Champignons');
INSERT INTO Category (name) VALUES ('Fleurs');
INSERT INTO Category (name) VALUES ('Arbustes');
INSERT INTO Category (name) VALUES ('Cactus');
INSERT INTO Category (name) VALUES ('Fougères');
INSERT INTO Category (name) VALUES ('Mousses');

-- Ajouter les sous-catégories pour la catégorie 'Arbres'
INSERT INTO Sub_category (name, category_id) VALUES ('le chêne', 1);
INSERT INTO Sub_category (name, category_id) VALUES ('le pin', 1);
INSERT INTO Sub_category (name, category_id) VALUES ('le bouleau', 1);
INSERT INTO Sub_category (name, category_id) VALUES ('autres', 1);

-- Ajouter les sous-catégories pour la catégorie 'Champignons'
INSERT INTO Sub_category (name, category_id) VALUES ('les amanites des césars', 2);
INSERT INTO Sub_category (name, category_id) VALUES ('les cèpes', 2);
INSERT INTO Sub_category (name, category_id) VALUES ('les bolets', 2);
INSERT INTO Sub_category (name, category_id) VALUES ('autres', 2);

-- Ajouter les sous-catégories pour la catégorie 'Fleurs'
INSERT INTO Sub_category (name, category_id) VALUES ('la tulipe', 3);
INSERT INTO Sub_category (name, category_id) VALUES ('le lilas', 3);
INSERT INTO Sub_category (name, category_id) VALUES ('la rose', 3);
INSERT INTO Sub_category (name, category_id) VALUES ('autres', 3);

-- Ajouter les sous-catégories pour la catégorie 'Arbustes'
INSERT INTO Sub_category (name, category_id) VALUES ('l’éléagnus', 4);
INSERT INTO Sub_category (name, category_id) VALUES ('le photinia', 4);
INSERT INTO Sub_category (name, category_id) VALUES ('le cyprès de leyland', 4);
INSERT INTO Sub_category (name, category_id) VALUES ('autres', 4);

-- Ajouter les sous-catégories pour la catégorie 'Cactus'
INSERT INTO Sub_category (name, category_id) VALUES ('Opuntia ficus indica', 5);
INSERT INTO Sub_category (name, category_id) VALUES ('Disocactus ackermannii', 5);
INSERT INTO Sub_category (name, category_id) VALUES ('Parodia scopa', 5);
INSERT INTO Sub_category (name, category_id) VALUES ('autres', 5);

-- Ajouter les sous-catégories pour la catégorie 'Fougères'
INSERT INTO Sub_category (name, category_id) VALUES ('Parodia scopa', 6);
INSERT INTO Sub_category (name, category_id) VALUES ('fougère d''Allemagne', 6);
INSERT INTO Sub_category (name, category_id) VALUES ('fougère royale', 6);
INSERT INTO Sub_category (name, category_id) VALUES ('autres', 6);

-- Ajouter les sous-catégories pour la catégorie 'Mousses'
INSERT INTO Sub_category (name, category_id) VALUES ('autres', 7);

-- Créer les utilisateurs Enzo, Matthieu, Maxime et Alister avec des numéros de rue
INSERT INTO Users (first_name, last_name, email, password, address_city, address_postal_code, address_street) 
VALUES 
('Enzo', 'Dupont', 'enzo.dupont@example.com', 'motdepasse_enzo', 'Paris', '75001', '1 Rue de la Paix'),
('Matthieu', 'Martin', 'matthieu.martin@example.com', 'motdepasse_matthieu', 'Lyon', '69001', '2 Avenue des Arts'),
('Maxime', 'Durand', 'maxime.durand@example.com', 'motdepasse_maxime', 'Marseille', '13001', '3 Boulevard des Sciences'),
('Alister', 'Lefevre', 'alister.lefevre@example.com', 'motdepasse_alister', 'Bordeaux', '33000', '4 Place de la Liberte');

-- Annonces avec category_id=1
INSERT INTO Advertisements (id, title, description, user_id, longitude, latitude, category_id, sub_category_id) 
VALUES (1, 'Annonce 1', 'Description de l annonce 1', 1, '45.123', 2.456, 1, 1);

INSERT INTO Advertisements (id, title, description, user_id, longitude, latitude, category_id, sub_category_id) 
VALUES (2, 'Annonce 2', 'Description de l annonce 2', 2, '46.789', 3.987, 1, 2);

INSERT INTO Advertisements (id, title, description, user_id, longitude, latitude, category_id, sub_category_id) 
VALUES (3, 'Annonce 3', 'Description de l annonce 3', 3, '47.654', 2.345, 1, 1);

INSERT INTO Advertisements (id, title, description, user_id, longitude, latitude, category_id, sub_category_id) 
VALUES (4, 'Annonce 4', 'Description de l annonce 4', 4, '48.987', 1.234, 1, 2);

-- Annonces avec category_id=2
INSERT INTO Advertisements (id, title, description, user_id, longitude, latitude, category_id, sub_category_id) 
VALUES (5, 'Annonce 5', 'Description de l annonce 5', 5, '49.876', 4.567, 2, 1);

INSERT INTO Advertisements (id, title, description, user_id, longitude, latitude, category_id, sub_category_id) 
VALUES (6, 'Annonce 6', 'Description de l annonce 6', 6, '50.654', 3.210, 2, 1);

INSERT INTO Advertisements (id, title, description, user_id, longitude, latitude, category_id, sub_category_id) 
VALUES (7, 'Annonce 7', 'Description de l annonce 7', 7, '51.987', 2.345, 2, 1);

-- Annonces avec category_id allant de 3 à 7
INSERT INTO Advertisements (id, title, description, user_id, longitude, latitude, category_id, sub_category_id) 
VALUES (8, 'Annonce 8', 'Description de l annonce 8', 8, '52.345', 3.456, 3, 1);

INSERT INTO Advertisements (id, title, description, user_id, longitude, latitude, category_id, sub_category_id) 
VALUES (9, 'Annonce 9', 'Description de l annonce 9', 9, '53.678', 4.567, 4, 1);

INSERT INTO Advertisements (id, title, description, user_id, longitude, latitude, category_id, sub_category_id) 
VALUES (10, 'Annonce 10', 'Description de l annonce 10', 10, '54.789', 5.678, 5, 1);

INSERT INTO Advertisements (id, title, description, user_id, longitude, latitude, category_id, sub_category_id) 
VALUES (11, 'Annonce 11', 'Description de l annonce 11', 11, '55.890', 6.789, 6, 1);

INSERT INTO Advertisements (id, title, description, user_id, longitude, latitude, category_id, sub_category_id) 
VALUES (12, 'Annonce 12', 'Description de l annonce 12', 12, '56.901', 7.890, 6, 1);


-- Conseils pour les annonces existantes
INSERT INTO Advice (id, advertisement_id, user_id, advice) 
VALUES (1, 1, 1, 'Conseil pour l annonce 1');

INSERT INTO Advice (id, advertisement_id, user_id, advice) 
VALUES (2, 2, 2, 'Conseil pour l annonce 2');

INSERT INTO Advice (id, advertisement_id, user_id, advice) 
VALUES (3, 3, 3, 'Conseil pour l annonce 3');

INSERT INTO Advice (id, advertisement_id, user_id, advice) 
VALUES (4, 4, 4, 'Conseil pour l annonce 4');

INSERT INTO Advice (id, advertisement_id, user_id, advice) 
VALUES (5, 5, 5, 'Conseil pour l annonce 5');

INSERT INTO Advice (id, advertisement_id, user_id, advice) 
VALUES (6, 6, 6, 'Conseil pour l annonce 6');

INSERT INTO Advice (id, advertisement_id, user_id, advice) 
VALUES (7, 7, 7, 'Conseil pour l annonce 7');
