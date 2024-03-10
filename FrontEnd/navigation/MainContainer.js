import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Text } from "react-native";

// Screens
import HomeScreen from "./screens/HomeScreen";
import ResearchScreen from "./screens/ResearchScreen";
import AddScreen from "./screens/AddScreen";
import ChatScreen from "./screens/ChatScreen";
import ProfileScreen from "./screens/ProfileScreen";
import AdDetailsScreen from "./screens/AdDetailsScreen";
import SignupScreen from "./screens/UsersScreen/SignUpScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export default function MainContainer() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="AdDetailsScreen" component={AdDetailsScreen} />
        <Stack.Screen name="SignupScreen" component={SignupScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Accueil"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Accueil") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Rechercher") {
            iconName = focused ? "search" : "search-outline";
          } else if (route.name === "Ajouter") {
            iconName = focused ? "add-circle" : "add-circle-outline";
          } else if (route.name === "Message") {
            iconName = focused ? "chatbubbles" : "chatbubbles-outline";
          } else if (route.name === "Profil") {
            iconName = focused ? "person" : "person-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#A3D288",
        tabBarInactiveTintColor: "grey",
        tabBarLabelStyle: { paddingBottom: 0, fontSize: 10 },
        tabBarStyle: { paddingTop: 10, height: 80 },
      })}
    >
      <Tab.Screen
        name="Accueil"
        component={HomeScreen}
        options={{
          headerShown: true, // Afficher l'en-tête
          headerStyle: { height: 110}, // Style de l'en-tête
          headerTintColor: "white", // Couleur du texte de l'en-tête
          headerTitle: () => (
            <Text style={{ fontSize: 30, fontWeight: "bold"}}>A Rosa-je</Text>
          ),

        }}
      />
      <Tab.Screen name="Rechercher" component={ResearchScreen} />
      <Tab.Screen
        name="Ajouter"
        component={AddScreen}
        options={{
          headerShown: true, // Afficher l'en-tête
          headerStyle: { height: 110}, // Style de l'en-tête
          headerTintColor: "white", // Couleur du texte de l'en-tête
          headerTitle: () => (
            <Text style={{ fontSize: 20}}>Ajouter une annonce</Text>
          ),

        }}
      />
      <Tab.Screen name="Message" component={ChatScreen} />
      <Tab.Screen name="Profil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
