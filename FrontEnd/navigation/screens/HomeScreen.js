import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { IP_Server } from '../../components/const';

// Constante qui stocke l'adresse IP du serveur
const IP = IP_Server;

const HomeScreen = () => {
  // State pour stocker les catégories avec les annonces
  const [categoriesWithAds, setCategoriesWithAds] = useState([]);
  // State pour le chargement initial
  const [loading, setLoading] = useState(true);
  // State pour stocker les sous-catégories
  const [subCategories, setSubCategories] = useState([]);
  // Hook pour la navigation
  const navigation = useNavigation();
  // State pour le rafraîchissement des données
  const [refreshing, setRefreshing] = useState(false);

  // Hook useEffect pour effectuer des actions après le rendu initial
  useEffect(() => {
    // Fonction asynchrone pour récupérer les sous-catégories
    const fetchSubCategories = async () => {
      try {
        const response = await fetch(`${IP}/sub_category`);
        const data = await response.json();
        setSubCategories(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des sous-catégories :", error);
      }
    };

    // Appel de la fonction pour récupérer les sous-catégories
    fetchSubCategories();
    // Appel de la fonction pour récupérer les catégories avec les annonces
    fetchCategoriesWithAds();
  }, []);

  // Fonction pour récupérer les catégories avec les annonces
  const fetchCategoriesWithAds = async () => {
    try {
      const response = await fetch(`${IP}/category`);
      const data = await response.json();

      // Récupération des annonces pour chaque catégorie
      const categoriesWithAdsData = await Promise.all(
        data.map(async (category) => {
          const adsResponse = await fetch(`${IP}/advertisements/category/${category.id}`);
          const adsData = await adsResponse.json();
          
          // Récupération des images pour chaque annonce
          const adsWithData = await Promise.all(
            adsData.map(async (ad) => {
              const imagesResponse = await fetch(`${IP}/images/all/${ad.id}`);
              const imagesData = await imagesResponse.json();
              return { ...ad, images: imagesData };
            })
          );
          return { ...category, ads: adsWithData };
        })
      );

      // Mise à jour du state avec les catégories et les annonces
      setCategoriesWithAds(categoriesWithAdsData);
      setLoading(false); // Fin du chargement
    } catch (error) {
      console.error("Erreur lors de la récupération des catégories et annonces :", error);
    }
  };

  // Fonction pour naviguer vers les détails d'une annonce
  const navigateToAdDetails = (adId) => {
    navigation.navigate("AdDetailsScreen", { adId });
  };

  // Fonction pour rendre un élément d'annonce
  const renderAdItem = ({ item }) => {
    const subCategory = subCategories.find(sub => sub.id === item.sub_category_id);
    const subCategoryName = subCategory ? subCategory.name : '';
    const truncatedTitle = item.title.length > 50 ? item.title.slice(0, 35) + "..." : item.title;
    return (
      <TouchableOpacity onPress={() => navigateToAdDetails(item.id)}>
        <View style={styles.adContainer}>
          <Image
            source={{ uri: `data:image/jpeg;base64,${item.images[0].image}` }}
            style={styles.adImage}
          />
          <View style={styles.MoreInfoContainer}>
            <View style={styles.adTitleContainer}>
              <Text style={styles.adTitle}>{truncatedTitle}</Text>
              <View style={styles.MoreInfoContainer}>
                <View style={styles.locationContainer}>
                  <Text style={styles.adCity}>{item.city}</Text>
                  <Text style={styles.adPostaleCode}>{item.postal_code}</Text>
                </View>
                <View style={styles.dateContainer}>
                  <Text style={styles.adStartDate}>{item.start_date}</Text>
                  <Text> - </Text>
                  <Text style={styles.adEndDate}>{item.end_date}</Text>
                </View>
                <View style={styles.subCategoriesContainer}>
                  <Text style={styles.subCategories}>{subCategoryName}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // Fonction pour rendre un élément de catégorie
  const renderCategoryItem = ({ item }) => (
    <View style={{ padding: 10 }}>
      <Text style={{ fontWeight: "bold", fontSize: 18, color: "#767676", }}>{item.name}</Text>
      <Text style={{ fontWeight: "normal", fontSize: 14, color:"#989696", marginBottom: 20 }}>Types de plantes qui pourraient vous intéresser ...</Text>
      <FlatList
        data={item.ads}
        renderItem={renderAdItem}
        keyExtractor={(ad) => ad.id.toString()}
        horizontal={true}
        contentContainerStyle={styles.scrollViewContent}
      />
    </View>
  );

  // Fonction pour gérer le rafraîchissement des données
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchCategoriesWithAds();
    } catch (error) {
      console.error("Erreur lors du rafraîchissement des données :", error);
    }
    setRefreshing(false);
  };

  // Affichage d'un indicateur de chargement si les données sont en cours de chargement
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center"}}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Rendu principal avec la liste des catégories et des annonces
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={categoriesWithAds}
        renderItem={renderCategoryItem}
        keyExtractor={(category) => category.id.toString()}
        onRefresh={handleRefresh}
        refreshing={refreshing}
      />
    </View>
  );
};

export default HomeScreen;

// Styles CSS pour les composants
const styles = StyleSheet.create({
  adContainer:{
    width: 220,
    height: 280,
  },
  MoreInfoContainer:{
    flex: 1,
    justifyContent:"space-between"
  },
  adImage:{
    width: 220,
    height: 170,
    borderRadius: 25,
  },
  adTitleContainer: {
    height: 100,
    justifyContent: "center",
  },
  adTitle:{
    fontSize: 18,
    fontWeight:"bold",
    color:"#767676",
    marginHorizontal: 5,
  },
  locationContainer:{
    flexDirection:"row", 
    alignItems: 'flex-end', 
    gap: 4,
    marginHorizontal: 5,
  },
  adCity:{
    fontSize: 16,
    fontWeight: 'medium',
    color:"#4A4A4A",
  },
  adPostaleCode:{
    color:"#4A4A4A"
  },
  dateContainer:{
    flexDirection: "row",
    marginHorizontal: 5,
  },
  adStartDate:{
    color:"#4A4A4A",
  },
  adEndDate:{
    color:"#4A4A4A",
  },
  subCategoriesContainer:{
    marginTop: 5,
    backgroundColor:"#D9D9D9",
    width: "auto",
    alignSelf: 'flex-start',
    borderRadius: 10,
    marginHorizontal: 5,
  },
  subCategories:{
    color:"#767676",
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  scrollViewContent: {
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
});
