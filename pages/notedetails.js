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
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeDetailsButton} onPress={() => navigation.goBack()}>
          <Icon name="keyboard-arrow-left" size={33} color="#000" />
        </TouchableOpacity>
        <TextInput
          style={styles.title}
          value={title}
          onChangeText={(text) => setTitle(text)}
          placeholder="Title"
        />
          <TouchableOpacity style={styles.deleteButton} onPress={deleteNote}>
            <Icon name="delete" size={30} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.summarizeButton} onPress={summarizeNote}>
            <Icon name="description" size={30} color="#000" />
          </TouchableOpacity>
      </View>
      <TextInput
        style={styles.content}
        value={content}
        onChangeText={(text) => setContent(text)}
        multiline
        placeholder="Content"
      />
      <View style={styles.footer}>
        
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginTop: 10,
  },
  header: {
    height: 60,
    borderBottomWidth: 2,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderBottomColor: '#ffa500',
    flexDirection: 'row',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    left: 20,
  },
  content: {
    fontSize: 20,
    top:0,
    fontWeight: '400',
    padding: 10,
  },
  deleteButton: {
    justifyContent: 'center',
    marginLeft:'auto',
    marginRight: 20,
  },
  summarizeButton: {
    marginRight: 20,
    justifyContent: 'center',
  },
  closeDetailsButton: {
    justifyContent: 'center',
    marginLeft: 0,
  },
  headerExtra: {
    marginTop: 'auto',
    flexDirection: 'row',
  }
});

export default NoteDetails;
