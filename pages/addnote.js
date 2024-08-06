import React, { useState } from 'react';
import { Text, View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { FIREBASE_DB, FIREBASE_AUTH } from '../config/firebase';
import Icon from 'react-native-vector-icons/MaterialIcons';

const AddNote = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const auth = FIREBASE_AUTH;

  const saveNote = async () => {
    try {
      const userId = auth.currentUser.uid;
      await addDoc(collection(FIREBASE_DB, 'ListOfNotes'), {
        title,
        content,
        userId,
        createdAt: serverTimestamp(),
      });
      console.log('Note added successfully');
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  const handleSaveAndContinue = async () => {
    await saveNote();
    // Don't navigate back to LandingPage immediately
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Add Note</Text>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Content"
        value={content}
        onChangeText={setContent}
        multiline
      />
      <TouchableOpacity style={styles.saveButton} onPress={handleSaveAndContinue}>
        <Icon name="check" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    height: '30%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  headerText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    padding: 8,
    marginVertical: 8,
    fontSize: 18,
  },
  saveButton: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: '#f44336',
    borderRadius: 30,
    padding: 16,
  },
});

export default AddNote;
