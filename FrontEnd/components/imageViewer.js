import { StyleSheet, Image, View, TouchableOpacity } from 'react-native';
import AntDesign from "@expo/vector-icons/AntDesign";
import { RotateInUpLeft } from 'react-native-reanimated';

export default function ImageViewer({ placeholderImageSource, selectedImage, onDelete , theme }) {
    const imageSource = selectedImage  ? { uri: selectedImage } : placeholderImageSource;
  
    if(theme == 'deletable') {
      return (
        <View style={styles.container}>
          <Image source={imageSource} style={styles.image} />
          {selectedImage && (
            <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
              <AntDesign
                name="plus"
                size={20}
                color="#A3D288"
                style={styles.deleteIcon}
              />
            </TouchableOpacity>
          )}
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <Image source={imageSource} style={styles.image} />
        </View>
      );
    }
  }

const styles = StyleSheet.create({
  image: {
    width: 150,
    height: 150,
    borderRadius: 18,
  },
  deleteIcon: {
    transform: [{ rotate: '45deg' }],
  },
  deleteButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 15,
  },
});
