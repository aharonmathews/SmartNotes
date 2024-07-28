import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation, useRoute } from "@react-navigation/native";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { FIREBASE_DB } from "../config/firebase"; // Ensure the correct import

const NoteDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { note } = route.params;
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [isEditing, setIsEditing] = useState(false);

  const handleUpdate = async () => {
    try {
      await updateDoc(doc(FIREBASE_DB, "ListOfNotes", note.id), {
        title,
        content,
        updatedAt: new Date(),
      });
      navigation.goBack();
    } catch (error) {
      console.error("Error updating note: ", error);
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      "Delete Note",
      "Are you sure you want to delete this note?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              await deleteDoc(doc(FIREBASE_DB, "ListOfNotes", note.id));
              navigation.goBack();
            } catch (error) {
              console.error("Error deleting note: ", error);
            }
          },
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
            <Icon name="pencil" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete}>
            <Icon name="trash" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
      {isEditing ? (
        <>
          <TextInput
            style={styles.title}
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={styles.content}
            placeholder="Note"
            value={content}
            onChangeText={setContent}
            multiline
          />
          <TouchableOpacity style={styles.saveButton} onPress={handleUpdate}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.content}>{content}</Text>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
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
  headerRight: {
    flexDirection: "row",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  content: {
    fontSize: 18,
    lineHeight: 24,
  },
  saveButton: {
    backgroundColor: "black",
    padding: 10,
    alignItems: "center",
    borderRadius: 5,
    marginTop: 16,
  },
  saveButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default NoteDetails;
