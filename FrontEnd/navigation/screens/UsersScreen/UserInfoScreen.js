import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { useAuth } from "../../../components/AuthContext";
import { IP_Server } from "../../../components/const";
import ButtonEdit from "../../../components/button";
import ConfirmationModal from "../../../components/confirmationModal";

const UserInfoScreen = ({ onLogOut }) => {
  const { user, updateUser } = useAuth();
  const [editedUser, setEditedUser] = useState(user);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const IP = IP_Server;

  console.log("user", user);

  const handleChange = (field, value) => {
    setEditedUser({ ...editedUser, [field]: value });
  };

  const handleSave = async () => {
    try {
      // Faire la requête PUT à l'API pour mettre à jour les informations de l'utilisateur
      const response = await fetch(`${IP}/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedUser),
      });

      if (!response.ok) {
        throw new Error("Failed to update user information");
      }

      // Mettre à jour les informations de l'utilisateur dans le contexte d'authentification
      updateUser(editedUser);
    } catch (error) {
      console.error("Error updating user information:", error);
    }
  };

  // Fonction pour ouvrir le modal de confirmation
  const onDeleteAccount = () => {
    setDeleteModalVisible(true);
  };

  // Fonction pour annuler la suppression du compte
  const cancelDeleteAccount = () => {
    setDeleteModalVisible(false);
  };

  const confirmDeleteAccount = async () => {
    try {
      // Faire la requête DELETE à l'API pour supprimer le compte utilisateur
      const response = await fetch(`${IP}/users/${user.id}`, {
        method: "DELETE",
      });
  
      if (!response.ok) {
        throw new Error("Failed to delete user account");
      }
  
      // Déconnecter l'utilisateur localement après avoir supprimé son compte
      onLogOut();
    } catch (error) {
      console.error("Error deleting user account:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.label}>Prénom:</Text>
        <TextInput
          style={styles.input}
          placeholder="First Name"
          value={editedUser.first_name}
          onChangeText={(text) => handleChange("first_name", text)}
        />
        <Text style={styles.label}>Nom:</Text>
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          value={editedUser.last_name}
          onChangeText={(text) => handleChange("last_name", text)}
        />
        <Text style={styles.label}>Email:</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={editedUser.email}
          onChangeText={(text) => handleChange("email", text)}
        />
      </View>
      <View style={styles.sendButtonContainer}>
        <ButtonEdit
          style={styles.button}
          theme="primary-full"
          label="Sauvegarder"
          onPress={handleSave}
        />
      </View>
      <View style={styles.sendButtonContainer}>
        <ButtonEdit
          style={styles.button}
          theme="primary-border"
          label="Se déconnecter"
          onPress={onLogOut}
        />
      </View>
      <View style={styles.sendButtonContainer}>
        <ButtonEdit
          theme="primary-border"
          label="Supprimer le compte"
          onPress={onDeleteAccount}
        />
      </View>
      {/* Modal de confirmation pour la suppression du compte */}
      <ConfirmationModal
        visible={isDeleteModalVisible}
        onClose={cancelDeleteAccount}
        onConfirm={confirmDeleteAccount}
        message="Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible."
      />
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    width: "100%",
    marginBottom: 20,
  },
  infoContainer: {
    width: "100%",
    marginBottom: 20,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 5,
  },
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
    borderRadius: 10,
  },
  sendButtonContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
});

export default UserInfoScreen;
