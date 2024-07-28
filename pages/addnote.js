import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import { addDoc, collection } from "firebase/firestore";
import { FIREBASE_DB, FIREBASE_AUTH } from "../config/firebase"; // Ensure the correct import

const AddNote = () => {
  const navigation = useNavigation();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const userId = FIREBASE_AUTH.currentUser.uid;

  const handleSave = async () => {
    try {
      await addDoc(collection(FIREBASE_DB, "ListOfNotes"), {
        title,
        content,
        userId, // Add user ID
        createdAt: new Date(),
      });
      navigation.goBack();
    } catch (error) {
      console.error("Error adding note: ", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <TextInput
          style={styles.title}
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
        />
        <TouchableOpacity onPress={handleSave}>
          <Icon name="check" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.content}
        placeholder="Note"
        value={content}
        onChangeText={setContent}
        multiline
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 26,
    flex: 1,
    padding: 16,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  content: {
    fontSize: 18,
    lineHeight: 24,
  },
});

export default AddNote;
