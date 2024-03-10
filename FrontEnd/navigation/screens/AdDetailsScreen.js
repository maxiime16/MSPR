import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  SafeAreaView,
  Dimensions,
  StyleSheet,
  Image,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import MapView, { Circle } from "react-native-maps";
import Carousel, { Pagination } from "react-native-snap-carousel";
import { IP_Server } from "../../components/const";
import ButtonEdit from "../../components/button";
import { useAuth } from "../../components/AuthContext";

const IP = IP_Server;
const windowDimensions = Dimensions.get("window");

const AdDetailsScreen = () => {
  const route = useRoute();
  const { adId } = route.params;
  const navigation = useNavigation();
  const [adData, setAdData] = useState(null);
  const [imagesData, setImagesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [advice, setAdviceData] = useState(null);
  const [newAdvice, setNewAdvice] = useState("");
  const [userAuthor, setUserAuthor] = useState(null);
  const { user } = useAuth();

  console.log("user connecté", user);

  useEffect(() => {
    const fetchAdDetails = async () => {
      try {
        const response = await fetch(`${IP}/advertisements/${adId}`);
        const data = await response.json();

        // Importation des images
        const imagesResponse = await fetch(`${IP}/images/all/${adId}`);
        const imagesData = await imagesResponse.json();

        // Récupération des informations de l'utilisateur
        const userResponse = await fetch(`${IP}/users/${data.user_id}`);
        const userAuthorData = await userResponse.json();

        // Récupération des conseils
        const adviceResponse = await fetch(
          `${IP}/advices/advertisement/${adId}`
        );
        const adviceData = await adviceResponse.json();

        setUserAuthor(userAuthorData);

        console.log(userAuthor);
        setAdData(data);
        setImagesData(imagesData);
        setAdviceData(adviceData);
        setLoading(false);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des détails de l annonce :",
          error
        );
      }
    };

    fetchAdDetails();
  }, []);

  const handleNewAdviceChange = (text) => {
    setNewAdvice(text);
  };
  const handleSubmitAdvice = async () => {
    try {
      // Vérifier que le champ de texte n'est pas vide
      if (newAdvice.trim() === "") {
        // Afficher une alerte ou un message indiquant que le champ est vide
        return;
      }

      // Envoyer le nouveau conseil à l'API
      const response = await fetch(`${IP}/advices/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          advertisement_id: adId,
          advice: newAdvice,
          user_id: user.id, // Assurez-vous de stocker l'ID de l'utilisateur connecté
        }),
      });

      if (response.ok) {
        // Conseil partagé avec succès, réinitialiser le champ de texte
        setNewAdvice("");
        // Afficher un message de confirmation
        alert("Conseil partagé avec succès !");
      } else {
        // Afficher une alerte ou un message en cas d'erreur lors de l'envoi du conseil
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi du conseil :", error);
      // Afficher une alerte ou un message en cas d'erreur
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar translucent backgroundColor="transparent" />
      <ScrollView>
        <View style={styles.header}>
          <ButtonEdit
            style={styles.sendButton}
            theme="primary-border-small"
            label="Retour"
            onPress={handleGoBack}
          />
          {loading && <ActivityIndicator size="small" color="#A3D288" />}
        </View>
        {!loading && (
          <View style={{ flex: 1 }}>
            {/* Utilisation du Carousel pour afficher les images */}
            <Carousel
              data={imagesData.map((image) => ({
                image: `data:image/jpeg;base64,${image.image}`,
              }))} // Convertir les données d'image
              renderItem={({ item }) => (
                <View>
                  <Image source={{ uri: item.image }} style={styles.image} />
                  <Pagination
                    dotsLength={imagesData.length}
                    activeDotIndex={activeIndex}
                    containerStyle={styles.paginationContainer}
                    dotStyle={styles.dotStyle}
                    inactiveDotStyle={styles.inactiveDotStyle}
                    inactiveDotOpacity={0.4}
                    inactiveDotScale={0.6}
                  />
                </View>
              )}
              sliderWidth={windowDimensions.width}
              itemWidth={windowDimensions.width}
              onSnapToItem={(index) => setActiveIndex(index)} // Mettre à jour l'index actif lors du changement de diapositive
            />
            <View style={styles.infoContainer}>
              <View style={styles.author}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 15,
                  }}
                >
                  <Image
                    source={require("../../assets/profile_image.png")}
                    style={styles.profileImage}
                  />
                  <Text style={styles.text}>
                    {userAuthor.first_name} {userAuthor.last_name}
                  </Text>
                </View>
                <ButtonEdit
                  style={styles.messageButton}
                  theme="primary-border-small"
                  label="message"
                />
              </View>
              <Text style={styles.title}>{adData ? adData.title : ""}</Text>
              <Text style={styles.description}>
                {adData ? adData.description : ""}
              </Text>

              <View style={styles.divider}></View>

              <View style={styles.advices}>
                <Text style={styles.locationText}>
                  {advice && advice.length} conseils :
                </Text>

                {user && (
                  <View style={styles.newAdviceContainer}>
                    <TextInput
                      style={styles.input}
                      onChangeText={handleNewAdviceChange}
                      value={newAdvice}
                      placeholder="Donnez un conseil"
                      multiline={true}
                    />
                    <ButtonEdit theme="just-icon" border={1} icon="enter" color="gray" size={20} onPress={handleSubmitAdvice}/>
                  </View>
                )}

                {advice &&
                  advice.map((conseil, index) => (
                    <View key={conseil.id} style={styles.conseilContainer}>
                      <Text style={{fontSize:14, fontWeight:"bold"}}>
                        {conseil.first_name} {conseil.last_name}
                      </Text>
                      <Text>{conseil.advice}</Text>
                      {index !== advice.length - 1 && (
                        <View style={styles.separator} />
                      )}
                    </View>
                  ))}
              </View>

              <View style={styles.divider}></View>

              <View style={styles.mapContainer}>
                <Text style={styles.locationText}>
                  Ou se trouve le gardiennage :
                </Text>
                <View style={styles.mapBlock}>
                  {!loading && (
                    <MapView
                      style={styles.map}
                      initialRegion={{
                        latitude: adData.latitude,
                        longitude: adData.longitude,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                      }}
                    >
                      <Circle
                        center={{
                          latitude: adData.latitude,
                          longitude: adData.longitude,
                        }}
                        radius={200} // 200 mètres
                        fillColor="#A3D28880"
                      />
                    </MapView>
                  )}
                </View>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  backButton: {
    padding: 10,
  },
  title: {
    marginTop: 20,
    fontSize: 22,
  },
  description: {
    fontSize: 18,
  },
  image: {
    width: windowDimensions.width,
    height: 400,
  },
  infoContainer: {
    padding: 10,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  locationText: {
    fontSize: 20,
    marginBottom: 10,
  },
  mapBlock: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    marginVertical: 30,
    width: windowDimensions.width - 20,
    height: windowDimensions.height * 0.2,
    borderRadius: 10,
  },
  paginationContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
  },
  dotStyle: {
    width: 12,
    height: 12,
    borderRadius: 50,
    backgroundColor: "rgba(255, 255, 255, 0.92)",
  },
  inactiveDotStyle: {
    width: 20,
    height: 20,
    borderRadius: 50,
    backgroundColor: "rgba(255, 255, 255, 0.60)",
  },
  messageButton: {
    padding: 0,
    margin: 0,
  },
  author: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginRight: 15,
    marginVertical: 10,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 40,
  },
  divider: {
    borderBottomWidth: 2,
    borderBottomColor: "#DDDDDD",
    marginVertical: 20,
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: "#DDDDDD",
    marginHorizontal: 40,
    marginVertical: 10,
  },
  input: {
    height: 50,
    flex: 1,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius:10,
  },
  newAdviceContainer:{
    flexDirection: "row",
    flex: 1,
    gap: 10,
  }
});

export default AdDetailsScreen;
