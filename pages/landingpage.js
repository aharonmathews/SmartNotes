import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { FIREBASE_DB, FIREBASE_AUTH } from '../config/firebase';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Modal from 'react-native-modal';

const LandingPage = ({ navigation }) => {
  const [notes, setNotes] = useState([]);
  const auth = FIREBASE_AUTH;
  const [menuVisible, setMenuVisible] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const userId = auth.currentUser.uid;
      const q = query(collection(FIREBASE_DB, 'ListOfNotes'), where('userId', '==', userId));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const userNotes = [];
        querySnapshot.forEach((doc) => {
          userNotes.push({ id: doc.id, ...doc.data() });
        });
        setNotes(userNotes);
      }, (error) => {
        console.error("Error fetching notes: ", error);
      });

      return () => unsubscribe();
    }, [])
  );

  const renderNoteItem = ({ item }) => (
    <TouchableOpacity
      style={styles.noteItem}
      onPress={() => {
        console.log("Navigating to NoteDetails with noteId:", item.id);
        navigation.navigate('NoteDetails', { note: item });
      }}
    >
      <Text style={styles.noteTitle}>{item.title}</Text>
      <Text style={styles.noteContent}>{item.content}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Modal
        isVisible={menuVisible}
        onBackdropPress={() => setMenuVisible(false)}
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
        <TouchableOpacity style={styles.closeModalButton} onPress={() => setMenuVisible(false)}>
          <Icon name="close" size={30} color="#fff" />
        </TouchableOpacity>
      </Modal>

      <View style={styles.header}>
        <Text style={styles.headerText}>College Notes</Text>
      </View>
      <View style={styles.accessibilityBar}>
        <TouchableOpacity style={styles.menuButton} onPress={() => setMenuVisible(true)}>
          <Icon name={menuVisible ? 'close' : 'menu'} size={30} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.moreButton} onPress={() => console.log('Open more options')}>
          <Icon name="more-vert" size={30} color="#fff" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={notes}
        renderItem={renderNoteItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.noteList}
      />
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddNote')}>
        <Icon name="add" size={30} color="#fff" />
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
  accessibilityBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    backgroundColor: '#000',
  },
  menuButton: {
    padding: 8,
  },
  moreButton: {
    padding: 8,
  },
  noteList: {
    flexGrow: 1,
    paddingTop: 16,
  },
  noteItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  noteContent: {
    fontSize: 14,
  },
  addButton: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: '#f44336',
    borderRadius: 30,
    padding: 16,
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

export default LandingPage;
