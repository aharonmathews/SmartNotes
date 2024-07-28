// taskManager.js
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { FIREBASE_DB } from '../config/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveNote = async (userId, note) => {
  try {
    await addDoc(collection(FIREBASE_DB, 'ListOfNotes'), {
      userId,
      ...note,
    });
  } catch (error) {
    console.error("Error adding document: ", error);
  }
};

export const getNotes = async (userId) => {
  try {
    const q = query(collection(FIREBASE_DB, 'ListOfNotes'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    const notes = [];
    querySnapshot.forEach((doc) => {
      notes.push({ id: doc.id, ...doc.data() });
    });
    return notes;
  } catch (error) {
    console.error("Error fetching notes: ", error);
    throw error;
  }
};
