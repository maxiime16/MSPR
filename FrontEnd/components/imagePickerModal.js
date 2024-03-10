import React from 'react';
import { Modal, View, Text, TouchableOpacity, Keyboard, TouchableWithoutFeedback,  StyleSheet } from 'react-native';

import Button from './button';

export default function ImagePickerModal({ visible, onClose, onSelectFromGallery, onTakePhoto }) {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
      >
        <TouchableWithoutFeedback onPress={onClose}>
            <View style={styles.modalContainer}>
                <TouchableWithoutFeedback onPress={() => {}}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Sélectionner une option</Text>
                        <View style={styles.buttonsContainer}>
                            <Button theme="little" icon="picture" size={40} label="Galerie" onPress={onSelectFromGallery} />
                            <Button theme="little" icon="camerao" size={40} label="Camera" onPress={onTakePhoto} />
                            <Button theme="little" icon="close" size={40} color="#a5a5a5" label="Annuler" onPress={onClose} />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    flexDirection: 'column',
    width: 300,
  },
  modalTitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 15,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  modalButtonText: {
    fontSize: 18,
    textAlign: 'center',
  },
  cancelButtonText: {
    color: 'red',
  },
});
