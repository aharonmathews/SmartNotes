import React, { useState, useEffect, useCallback } from 'react';
import { Text, TextInput, View, StyleSheet, TouchableOpacity } from 'react-native';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { FIREBASE_DB } from '../config/firebase';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Modal from 'react-native-modal';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { showMessage } from "react-native-flash-message";
import { debounce } from 'lodash';

const NoteDetails = ({ route, navigation }) => {
  const { note } = route.params;
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [menuVisible, setMenuVisible] = useState(false);

  const noteRef = doc(FIREBASE_DB, 'ListOfNotes', note.id);

  // Debounced save function
  const saveNote = useCallback(
    debounce(async (newTitle, newContent) => {
      try {
        await updateDoc(noteRef, {
          title: newTitle,
          content: newContent,
        });
        console.log('Note auto-saved');
      } catch (error) {
        console.error('Error auto-saving note:', error);
      }
    }, 2000),
    []
  );

  useEffect(() => {
    saveNote(title, content);
    return () => {
      saveNote.cancel();
    };
  }, [title, content, saveNote]);

  const deleteNote = async () => {
    try {
      await deleteDoc(noteRef);
      console.log('Note deleted');
      navigation.goBack();
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const summarizeNote = async () => {
    try {
      const genAI = new GoogleGenerativeAI("AIzaSyDD07J4iNMK_-U_xEZz_B-8mFyiyiT-HAw");
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt = `Summarize the following note:\nTitle: ${title}\nContent: ${content}`;
      const result = await model.generateContent(prompt);
      const response = result.response;
      const summary = response.text();

      showMessage({
        message: "Note Summary",
        description: summary,
        type: "info",
        icon: "info",
        duration: 4000,
      });
    } catch (error) {
      console.error("Error summarizing note:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Modal
        isVisible={menuVisible}
        onBackdropPress={() => setMenuVisible(false)}
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <TouchableOpacity onPress={() => {
            setMenuVisible(false);
            navigation.navigate('LandingPage');
          }}>
            <Text style={styles.modalButton}>Notes</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            setMenuVisible(false);
            navigation.navigate('ChatBot');
          }}>
            <Text style={styles.modalButton}>ChatBot</Text>
          </TouchableOpacity>
          <Text style={styles.modalText}>Theme</Text>
          <TouchableOpacity onPress={() => console.log('Switch to Light Mode')}>
            <Text style={styles.modalButton}>Light Mode</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => console.log('Switch to Dark Mode')}>
            <Text style={styles.modalButton}>Dark Mode</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.closeModalButton} onPress={() => setMenuVisible(false)}>
          <Icon name="close" size={30} color="#fff" />
        </TouchableOpacity>
      </Modal>
      <View style={styles.header}>
        <TextInput
          style={styles.title}
          value={title}
          onChangeText={(text) => setTitle(text)}
          placeholder="Title"
        />
      </View>
      <TextInput
        style={styles.content}
        value={content}
        onChangeText={(text) => setContent(text)}
        multiline
        placeholder="Content"
      />
      <View style={styles.footer}>
        <TouchableOpacity style={styles.deleteButton} onPress={deleteNote}>
          <Icon name="delete" size={30} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.summarizeButton} onPress={summarizeNote}>
          <Icon name="description" size={30} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    height: 60,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    fontSize: 18,
    top:0
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    backgroundColor: '#000',
    bottom: 0
  },
  deleteButton: {
    padding: 8,
  },
  summarizeButton: {
    padding: 8,
    
  },
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
});

export default NoteDetails;
