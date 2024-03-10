import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default function MapScreen() {
  const [address, setAddress] = useState('');
  const [coordinates, setCoordinates] = useState(null);

  const handleSearch = async () => {
    // Effectuer une recherche pour obtenir les coordonnées de l'adresse saisie
    // Utiliser un service de géocodage comme Google Maps Geocoding API

    // Exemple simplifié :
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address
      )}&key=AIzaSyBXAHTLR9ttEAdSJ4d3Tr28Xe0mtIFESn4`
    );
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      const { lat, lng } = data.results[0].geometry.location;
      setCoordinates({ latitude: lat, longitude: lng });
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={address}
        onChangeText={setAddress}
        placeholder="Entrez votre adresse"
      />
      <Button title="Rechercher" onPress={handleSearch} />
      <MapView style={styles.map} region={coordinates ? { ...coordinates, latitudeDelta: 0.05, longitudeDelta: 0.05 } : null}>
        {coordinates && <Marker coordinate={coordinates} />}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: '80%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  map: {
    width: '100%',
    height: '70%',
  },
});
