import React, { useState, useRef, useEffect} from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
} from "react-native";
import * as ImagePicker from "expo-image-picker"; // Image picker for import picture
import * as FileSystem from 'expo-file-system'; // File system for use picture
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete"; // Google maps API
import DropDownPicker from "react-native-dropdown-picker"; // Drop Down Picker
import axios from 'axios'; // HTTP request
import * as ImageManipulator from 'expo-image-manipulator'; // Reduire la taille des images
import DatePicker, { getToday } from 'react-native-modern-datepicker'; // Date picker
import { useAuth } from "../../components/AuthContext";


import ImageViewer from "../../components/imageViewer";
import ButtonEdit from "../../components/button";
import ImagePickerModal from "../../components/imagePickerModal";
import { IP_Server } from "../../components/const";


const IP = IP_Server;

export default function AddScreen({ navigation }) {
  const { user, updateUser } = useAuth(); 
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [coordinates, setCoordinates] = useState(null);
  //Category selection
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [categoryValue, setCategoryValue] = useState(null);
  const [categoryItems, setCategoryItems] = useState([]);
  //Sub Category selection
  const [subCategoryOpen, setSubCategoryOpen] = useState(false);
  const [subCategoryValue, setSubCategoryValue] = useState(null);
  const [subCategoryItems, setSubCategoryItems] = useState([]);
  //Start Date selection
  const [selectedStartDate, setSelectedStartDate] = useState('');
  const [selectedEndDate, setSelectedEndDate] = useState('');
  const currentDate = getToday();
  
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  
  const [formComplete, setFormComplete] = useState(false);
  const [submitButtonClicked, setSubmitButtonClicked] = useState(false);
  const [showErrorState, setShowErrorState] = useState(false)

  const titleInputRef = useRef(null);
  const descriptionInputRef = useRef(null);
  const imageInputRef = useRef(null);
  

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    if (!result.canceled) {
      const dateString = new Date().toISOString().split("T")[0];
      const newImages = result.assets.map((asset) => ({
        uri: asset.uri,
        name: `image${images.length + 1}-${dateString}.jpg`,
      }));
      setImages((prevImages) => [...prevImages, ...newImages]);
    }
  };

  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      const dateString = new Date().toISOString().split("T")[0];
      const newImage = {
        uri: result.uri,
        name: `image${images.length + 1}-${dateString}.jpg`,
      };
      setImages((prevImages) => [...prevImages, newImage]);
    }
  };

  const handleDeleteImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    console.log(images)
  };

  //Categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await axios.get(`${IP}/category`);
        const categoriesFromApi = response.data;

        // Transformation des données reçues pour les adapter au format attendu
        const adaptedCategories = categoriesFromApi.map(category => ({
          label: category.name,
          value: category.id
        }));

        // Mise à jour de l'état avec les catégories adaptées
        setCategoryItems(adaptedCategories);
      } catch (error) {
        console.error("Une erreur s'est produite lors de la récupération des catégories :", error);
      }
    }
    // Appel de la fonction pour récupérer les catégories lors du montage du composant
    fetchCategories();
  }, []);

  //Sub_categories
  useEffect(() => {
    async function fetchSubCategories() {
      try {
        if (categoryValue) {
          const response = await axios.get(`${IP}/sub_category/category/${categoryValue}/sub_category`);
          const subCategoriesFromApi = response.data;

          // Transformation des données reçues pour les adapter au format attendu
          const adaptedSubCategories = subCategoriesFromApi.map(category => ({
            label: category.name,
            value: category.id
          }));

          // Mise à jour de l'état avec les catégories adaptées
          setSubCategoryItems(adaptedSubCategories);
        }
      } catch (error) {
        console.error("Une erreur s'est produite lors de la récupération des sous catégories :", error);
      }
    }

    // Appel de la fonction pour récupérer les sous-catégories lorsque categoryValue change
    fetchSubCategories();
  }, [categoryValue]);

  // Modifiez votre useEffect pour vérifier si le formulaire est complet
  useEffect(() => {
    setFormComplete(
      title.trim().length > 0 &&
      description.trim().length > 0 &&
      coordinates !== null &&
      categoryValue !== null &&
      subCategoryValue !== null &&
      images.length > 0 &&
      selectedStartDate !== null &&
      selectedEndDate !== null &&
      postalCode !== null &&
      city !== null
    );
  }, [title, description, coordinates, categoryValue, subCategoryValue, images, selectedStartDate, selectedEndDate, postalCode, city]);

  useEffect(() => {
    const showError = submitButtonClicked && !formComplete;
    setShowErrorState(showError); 
  }, [submitButtonClicked, formComplete]);

  useEffect(() => {
    
    console.log(coordinates)
  }, [coordinates]);


  const sendForm = async () => {
    setSubmitButtonClicked(true);

    // Vérification des champs obligatoires
    if (!title || !description || !coordinates || !categoryValue || !subCategoryValue || !selectedStartDate || !selectedEndDate|| !postalCode || !city || images.length === 0) {
      return; 
    }


    try {
      // Envoi des données du formulaire à la table Advertisements
      const advertisementResponse = await axios.post(`${IP}/advertisements/create`, {
        title,
        description,
        user_id: user.id, 
        longitude: coordinates.lng,
        latitude: coordinates.lat,
        category_id: categoryValue,
        sub_category_id: subCategoryValue,
        start_date: selectedStartDate,
        end_date: selectedEndDate,
        city: city,
        postal_code: postalCode
      });

      // Récupérer l'ID de la nouvelle annonce créée
      const advertisementId = advertisementResponse.data.id;

      // Envoyer les images à la base de données des images
      await uploadImages(advertisementId);

    } catch (error) {
      console.error("Une erreur s'est produite lors de l'envoi du formulaire :", error);
    }

  };

  const uploadImages = async (advertisementId) => {
    try {
      for (const image of images) {
        // Redimensionner et compresser l'image
        const resizedImage = await ImageManipulator.manipulateAsync(
          image.uri,
          [{ resize: { width: 500, height: 500 } }],
          { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG }
        );

        // Convertir le contenu de l'image redimensionnée en chaîne base64
        const base64 = await FileSystem.readAsStringAsync(resizedImage.uri, { encoding: FileSystem.EncodingType.Base64 });

        console.log("Taille de l'image après la compression :", base64.length);
        console.log(advertisementId)

        // Envoyer les données de l'image redimensionnée à la route "upload" de la table "Images"
        const imageResponse = await axios.post(`${IP}/images/upload/${advertisementId}`, {
          image: base64,
        });
      }
      console.log("Toutes les images ont été envoyées avec succès !");
    } catch (error) {
      console.error("Une erreur s'est produite lors de l'envoi des images :", error);
    }
  };

  if (!user) {
    return (
      <View style={styles.Informationcontainer}>
        <Text style={styles.InformationMessage}>Vous devez être connecté pour ajouter une annonce.</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <ScrollView
          style={{ flex: 1 }}
          nestedScrollEnabled={true}
          keyboardShouldPersistTaps="handled"
        >
          {images.length == 0 && (
            <View style={[styles.buttonContainer, { marginBottom: 15 }]}>
              <ButtonEdit
                style={styles.buttonAddImage1}
                theme="primary-icon"
                icon="plus"
                label="Ajouter photos"
                onPress={() => setModalVisible(true)}
              />
            </View>
          )}
          {images.length > 0 && (
            <View style={[styles.ImageContainer, { marginBottom: 15 }]}>
              <ScrollView horizontal={true}>
                <View style={styles.imageAndButton}>
                  {images.map((image, index) => (
                    <ImageViewer
                      key={index}
                      theme="deletable"
                      selectedImage={image.uri}
                      onDelete={() => handleDeleteImage(index)}
                      style={styles.imageItem}
                    />
                  ))}
                  <ButtonEdit
                    style={styles.buttonInImage}
                    theme="just-icon"
                    icon="plus"
                    onPress={() => setModalVisible(true)}
                  />
                </View>
              </ScrollView>
            </View>
          )}

          <Text style={[styles.label, { paddingTop: 10 }]}>
            Nom de l'annonce
          </Text>
          <TextInput
            ref={titleInputRef}
            style={styles.input}
            value={title}
            placeholder="Ex: Recherche jardinier ..."
            onChangeText={setTitle}
            onSubmitEditing={() => descriptionInputRef.current.focus()}
          />
          <Text style={styles.label}>Description</Text>
          <TextInput
            ref={descriptionInputRef}
            style={[styles.input, styles.multilineInput, { marginBottom: 15 }]}
            value={description}
            placeholder="Ex: Besoin d'une personne pour s'occuper de mes plantes ..."
            onChangeText={setDescription}
            multiline
            onSubmitEditing={() => imageInputRef.current.focus()}
          />

          {/* Adresse Google maps */}
          <View style={{ marginBottom: 10 }}>
            <Text style={[styles.label, { paddingTop: 10 }]}>Adresse</Text>
            <ScrollView
              horizontal={true}
              nestedScrollEnabled={true}
              keyboardShouldPersistTaps='handled'
              contentContainerStyle={{ flexGrow: 1 }}
            >
              <GooglePlacesAutocomplete
                placeholder="2 rue Alphonse Colas, Pl. du Concert, Lille"
                onPress={(data, details = null) => {
                  if (details) {
                    // Extraire la ville à partir des détails de l'adresse
                    const city = details.address_components.find(component =>
                      component.types.includes("locality")
                    );

                    // Extraire le code postal à partir des détails de l'adresse
                    const postalCode = details.address_components.find(component =>
                      component.types.includes("postal_code")
                    );
              
                    // Vérifier si la ville a été trouvée
                    if (city) {
                      // Utiliser la ville comme vous le souhaitez
                      console.log("Ville sélectionnée :", city.long_name);
                      console.log("Code postal :", postalCode.long_name);
                      // Stocker la ville dans un état par exemple
                      setCity(city.long_name);
                      setPostalCode(postalCode.long_name);
                    }
                  }
                  // Stocker également les coordonnées si nécessaire
                  setCoordinates(details.geometry.location);
                }}
                query={{
                  key: "AIzaSyBk7T5n-mYooDyw9eHCK1OkOs4AQp4Ttq4",
                  language: "fr",
                }}
                fetchDetails={true}
                enablePoweredByContainer={false}
              />
            </ScrollView>
          </View>

          {/* Category selection */}
          <View style={styles.dropDownPicker}>
            <DropDownPicker
              open={categoryOpen}
              value={categoryValue}
              items={categoryItems}
              setOpen={setCategoryOpen}
              setValue={setCategoryValue}
              setItems={setCategoryItems}
              disableBorderRadius={true}
              listMode="MODAL"
              modalAnimationType="slide"
              modalTitle="Sélectionner une catégorie"
              placeholder="Catégorie"
              placeholderStyle={{
                color: "grey",
              }}
              showArrowIcon={true}
              mode="BADGE"
              searchable={true}
              searchTextInputProps={{
                maxLength: 25,
              }}
              searchPlaceholder="Ex: Arbre..."
              searchContainerStyle={{
                borderColor: "white",
                borderBottomColor: "#dfdfdf",
              }}
              customItemLabelStyle={{
                backgroundColor: "red",
              }}
              listParentLabelStyle={{
                fontWeight: "bold",
              }}
              listChildContainerStyle={{
                paddingLeft: 40,
              }}
              closeAfterSelecting={true}
              style={{
                borderColor: "white",
                borderRadius: 0,
                marginBottom: 15,
              }}
            />
          </View>
            
          {/* SubCategory selection */}
          {categoryValue &&( // if category selected 
            <View style={styles.dropDownPicker}>
              <DropDownPicker
                open={subCategoryOpen}
                value={subCategoryValue}
                items={subCategoryItems}
                setOpen={setSubCategoryOpen}
                setValue={setSubCategoryValue}
                setItems={setSubCategoryItems}
                disableBorderRadius={true}
                listMode="MODAL"
                modalAnimationType="slide"
                modalTitle="Sélectionner une catégorie"
                placeholder="Plantes"
                placeholderStyle={{
                  color: "grey",
                }}
                showArrowIcon={true}
                mode="BADGE"
                searchable={true}
                searchTextInputProps={{
                  maxLength: 25,
                }}
                searchPlaceholder="Ex: Tulipe..."
                searchContainerStyle={{
                  borderColor: "white",
                  borderBottomColor: "#dfdfdf",
                }}
                customItemLabelStyle={{
                  backgroundColor: "red",
                }}
                listParentLabelStyle={{
                  fontWeight: "bold",
                }}
                listChildContainerStyle={{
                  paddingLeft: 40,
                }}
                closeAfterSelecting={true}
                style={{
                  borderColor: "white",
                  borderRadius: 0,
                  marginBottom: 10,
                }}
              />
            </View>
          )}

          <View style={styles.datePicker}>
            <Text style={[styles.label, { paddingTop: 10 }]}>Date de début</Text>
            <DatePicker
                onSelectedChange={date => setSelectedStartDate(date)}
                mode="calendar"
                minimumDate={currentDate}
                options={{
                    selectedTextColor: '#fff',
                    mainColor: '#A3D288',
                  }}
              />

            {selectedStartDate &&(
              <View>
                <Text style={[styles.label, { paddingTop: 10 }]}>Date de fin</Text>
                <DatePicker
                    onSelectedChange={date => setSelectedEndDate(date)}
                    mode="calendar"
                    minimumDate={selectedStartDate}
                    current= {selectedStartDate}
                    options={{
                        selectedTextColor: '#fff',
                        mainColor: '#A3D288',
                      }}
                  />
              </View>

            )}
          </View>

          {/* Affichage du message d'erreur s'il y a lieu */}
          {submitButtonClicked && !formComplete && (
            <Text style={styles.errorMessage}>Veuillez remplir tous les champs avant de valider.</Text>
          )}
          

          {/* Submit button */}
          <View style={styles.sendButtonContainer}>
            <ButtonEdit
              style={styles.sendButton}
              theme="primary-full"
              label="Ajouter l'annonce"
              onPress={sendForm}
            />
          </View>

          <Text style={styles.footerText}>
            Soyez rassuré ...
          </Text>
          <Text style={styles.footerText}>
            L'adresse de votre logement est affiché sous la forme d'une zone geograpgique et non d'un point.
          </Text>

          {/* Image Picker Modal */}
          <ImagePickerModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSelectFromGallery={pickImage}
          onTakePhoto={takePhoto}
          />
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  label: {
    fontSize: 15,
    color: "#9b9b9b",
    textAlign: "left",
    paddingLeft: 10,
    backgroundColor: "white",
  },
  input: {
    borderWidth: 1,
    borderColor: "#fff",
    padding: 10,
    width: "100%",
    textAlign: "left",
    backgroundColor: "white",
  },
  multilineInput: {
    height: 100,
  },
  buttonContainer: {
    alignItems: "center",
    flex: 1,
    height: 150,
    justifyContent: "center",
  },
  ImageContainer: {
    margin: "auto",
    flex: 1,
    height: 200,
    justifyContent: "center",
    paddingLeft: 15,
  },
  imageAndButton: {
    flex: 1,
    gap: 15,
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    height: 200,
    justifyContent: "center",
  },
  buttonInImage: {
    alignSelf: "center",
    backgroundColor: "green",
  },
  imageItem: {
    width: 150,
    height: 150,
  },
  mapContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  map: {
    width: "100%",
    height: 300,
  },
  dropDownPicker: {
    flex: 1,
    maxHeight: 800,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  sendButtonContainer: {
    alignItems: "center",
    height: 100,
    justifyContent: "center",
  },
  footerText:{
    marginLeft:  20,
    marginRight:  20,
    marginBottom: 10,
    textAlign: "center",
    color: "grey",
  },

  invalidInput: {
    borderColor: 'red',
  },
  errorMessage: {
    textAlign: "center",
    color: 'red',
    fontSize:
    12,
  },
  Informationcontainer:{
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  InformationMessage:{
    color: "black",
    color: "#9b9b9b",
  },
  datePicker: {
    backgroundColor: "white",
  }
});
