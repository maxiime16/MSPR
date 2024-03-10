import React, { useState } from 'react';
import { View, Button } from 'react-native';

// Import des écrans liés à l'authentification
import LogInScreen from './UsersScreen/LogInScreen';
import UserInfoScreen from './UsersScreen/UserInfoScreen';
import SignUpScreen from './UsersScreen/SignUpScreen';
import { IP_Server } from '../../components/const'; 

// Constante pour l'adresse IP du serveur
const IP = IP_Server;

const ProfileScreen = () => {
  // States pour gérer l'état de connexion, les informations utilisateur et l'état de l'inscription
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isSignUp, setIsSignUp] = useState(false);

  // Fonction pour gérer la connexion de l'utilisateur
  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  // Fonction pour gérer la déconnexion de l'utilisateur
  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
  };

  // Fonction pour gérer l'inscription de l'utilisateur
  const handleSignUp = () => {
    setIsSignUp(true);
  };

  // Rendu conditionnel en fonction de l'état de connexion et de l'état d'inscription
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      {isLoggedIn ? (
          <UserInfoScreen user={user} onLogOut={handleLogout}/>
      ) : (
        isSignUp ? (
          <SignUpScreen setIsSignUp={setIsSignUp} />
        ) : (
          <LogInScreen onLogin={handleLogin} onSignUp={handleSignUp} />
        )
      )}
    </View>
  );
};

export default ProfileScreen;
