import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { collection, query, where, onSnapshot, deleteDoc, doc, writeBatch } from 'firebase/firestore';
import { FIREBASE_DB, FIREBASE_AUTH } from '../config/firebase';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Modal from 'react-native-modal';

const LandingPage = ({ navigation }) => {
  const [notes, setNotes] = useState([]);
  const [selectedNotes, setSelectedNotes] = useState([]);
  const [menuVisible, setMenuVisible] = useState(false);
  const auth = FIREBASE_AUTH;

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

  const toggleNoteSelection = (noteId) => {
    setSelectedNotes((prevSelectedNotes) => {
      if (prevSelectedNotes.includes(noteId)) {
        return prevSelectedNotes.filter((id) => id !== noteId);
      } else {
        return [...prevSelectedNotes, noteId];
      }
    });
  };

  const deleteSelectedNotes = async () => {
    try {
      const batch = writeBatch(FIREBASE_DB);
      selectedNotes.forEach((noteId) => {
        const noteRef = doc(FIREBASE_DB, 'ListOfNotes', noteId);
        batch.delete(noteRef);
      });
      await batch.commit();
      setSelectedNotes([]);
      console.log('Selected notes deleted successfully');
    } catch (error) {
      console.error('Error deleting selected notes:', error);
    }
  };

  const renderNoteItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.noteItem,
        selectedNotes.includes(item.id) && styles.selectedNoteItem,
      ]}
      onPress={() => {
        console.log("Navigating to NoteDetails with noteId:", item.id);
        navigation.navigate('NoteDetails', { note: item });
      }}
      onLongPress={() => toggleNoteSelection(item.id)}
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
            <Text style={styles.modalButton}>ChatBot(Gemini AI)</Text>
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
          <Icon name={menuVisible ? 'close' : 'menu'} size={30} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={deleteSelectedNotes}>
          <Icon name="delete" size={30} color="#000" />
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
    backgroundColor: '#f0ffff',
    
  },
  header: {
    height: '30%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0ffff',
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
    borderBottomWidth: 2,
    borderBottomColor: '#ffa500',
    borderRadius: 8,
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
    backgroundColor: '#ffa500',
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
    backgroundColor: '#f0ffff',
    padding: 16,
  },
  modalText: {
    fontSize: 21,
    marginBottom: 8,
    marginTop: 28,
  },
  modalButton: {
    fontSize: 20,
    color: '#ffa500',
    marginBottom: 8,
  },
  closeModalButton: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  selectedNoteItem: {
    backgroundColor: '#d3d3d3',
  },
  deleteButton: {
    padding: 8,
  },
});

export default LandingPage;
