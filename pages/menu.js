import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';

const MenuModal = ({ visible, onClose, navigation }) => {
  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      style={styles.modal}
    >
      <View style={styles.modalContent}>
        <Text style={styles.modalText}>Try Gemini AI</Text>
        <TouchableOpacity onPress={() => navigation.navigate('ChatBot')}>
          <Text style={styles.modalButton}>Chatbot</Text>
        </TouchableOpacity>
        <Text style={styles.modalText}>Theme</Text>
        <TouchableOpacity onPress={() => console.log('Switch to Light Mode')}>
          <Text style={styles.modalButton}>Light Mode</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => console.log('Switch to Dark Mode')}>
          <Text style={styles.modalButton}>Dark Mode</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.closeModalButton} onPress={onClose}>
        <Text style={styles.closeModalText}>X</Text>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-start',
    margin: 0,
  },
  modalContent: {
    width: '80%',
    height: '100%',
    backgroundColor: '#fff',
    padding: 16,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 8,
  },
  modalButton: {
    fontSize: 16,
    color: '#007BFF',
    marginBottom: 8,
  },
  closeModalButton: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  closeModalText: {
    fontSize: 18,
    color: '#fff',
  },
});

export default MenuModal;
