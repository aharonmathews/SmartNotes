// config/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD8HnMJ2RDg1mI9admURUh340tHWgw7NjA",
  authDomain: "note-taking-141e4.firebaseapp.com",
  projectId: "note-taking-141e4",
  storageBucket: "note-taking-141e4.appspot.com",
  messagingSenderId: "783864738414",
  appId: "1:783864738414:web:42faca5356ac9e0281ec7f",
  measurementId: "G-BRSCTNFJQ5"
};

const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_DB = getFirestore(FIREBASE_APP);
