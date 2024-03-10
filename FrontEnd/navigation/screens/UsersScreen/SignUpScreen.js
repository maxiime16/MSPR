import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,

} from "react-native";
import bcrypt from "react-native-bcrypt";
import { IP_Server } from "../../../components/const";
import ButtonEdit from "../../../components/button";

const IP = IP_Server;
const SignUpScreen = ({ setIsSignUp }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = () => {
  // Vérification des champs du formulaire
  if (!firstName || !lastName || !email || !password) {
    setErrorMessage("Veuillez remplir tous les champs du formulaire.");
    return;
  }

  // Vérification du format de l'adresse e-mail
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    setErrorMessage("Veuillez entrer une adresse e-mail valide.");
    return;
  }
  
  // Vérification du format du mot de passe
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  if (!passwordRegex.test(password)) {
    setErrorMessage(
      "Le mot de passe doit contenir au moins une minuscule, une majuscule, un numéro et être d'au moins 8 caractères."
    );
    return;
  }

  // Hashage du mot de passe
  const hashedPassword = bcrypt.hashSync(password, 10);
  
    // Réinitialiser le message d'erreur s'il n'y a pas d'erreur de validation
    setErrorMessage("");
  
    // Création de l'objet contenant les données du formulaire
    const userData = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: hashedPassword,
    };
  
    // Envoi de la requête POST à l'API
    fetch(`${IP}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })
      .then((response) => {
        if (!response.ok) {
          // Si la réponse du serveur n'est pas OK, gérer l'erreur
          return response.json().then((data) => {
            throw new Error(data.error); // Lance une erreur avec le message d'erreur personnalisé renvoyé par l'API
          });
        }
        return response.json();
      })
      .then((data) => {
        // Traitement de la réponse en cas de succès
        console.log("Success:", data);
        setIsSignUp(false)
      })
      .catch((error) => {
        // Gérer les erreurs ici
        console.error("Error:", error);
        // Afficher le message d'erreur personnalisé renvoyé par l'API
        setErrorMessage(error.message);
      });
  };
  
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Prénom"
        onChangeText={(text) => setFirstName(text)}
        value={firstName}
      />
      <TextInput
        style={styles.input}
        placeholder="Nom"
        onChangeText={(text) => setLastName(text)}
        value={lastName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={(text) => setEmail(text)}
        value={email}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        onChangeText={(text) => setPassword(text)}
        value={password}
        secureTextEntry
      />
      <Text style={styles.errorMessage}>{errorMessage}</Text>

      <View style={styles.sendButtonContainer}>
          <ButtonEdit
            style={styles.sendButton}
            theme="primary-full"
            label="S'inscrire"
            onPress={handleSubmit}
          />
        </View>
        <View style={styles.sendButtonContainer}>
          <ButtonEdit
            style={styles.sendButton}
            theme="primary-border"
            label="Se connecter "
            onPress={() => setIsSignUp(false)}
          />
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  input: {
    height: 50,
    width: 300,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius:10,
  },
  sendButtonContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  errorMessage: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
  loginButton: {
    color: "blue",
    marginTop: 10,
    textAlign: "center",
  },
});

export default SignUpScreen;
