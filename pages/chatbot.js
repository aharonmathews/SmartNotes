import React, { useState, useEffect } from "react";
import * as GoogleGenerativeAI from "@google/generative-ai";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import * as Speech from "expo-speech";
import Icon from "react-native-vector-icons/FontAwesome";
import FlashMessage, { showMessage } from "react-native-flash-message";

const GeminiChat = ({ navigation }) => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const API_KEY = "AIzaSyDD07J4iNMK_-U_xEZz_B-8mFyiyiT-HAw";

  useEffect(() => {
    const startChat = async () => {
      const genAI = new GoogleGenerativeAI.GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt = "hello! ";
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();
      console.log(text);
      showMessage({
        message: "Welcome to Gemini Chat 🤖",
        description: text,
        type: "info",
        icon: "info",
        duration: 2000,
      });
      setMessages([
        {
          text,
          user: false,
        },
      ]);
    };
    //function call
    startChat();
  }, []);

  const sendMessage = async () => {
    setLoading(true);
    const userMessage = { text: userInput, user: true };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    const genAI = new GoogleGenerativeAI.GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = userMessage.text;
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    setMessages((prevMessages) => [...prevMessages, { text, user: false }]);
    setLoading(false);
    setUserInput("");

    if (text && !isSpeaking) {
      Speech.speak(text);
      setIsSpeaking(true);
    }
  };

  const toggleSpeech = () => {
    console.log("isSpeaking", isSpeaking);
    if (isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
    } else {
      Speech.speak(messages[messages.length - 1].text);
      setIsSpeaking(true);
    }
  };

  const clearMessages = () => {
    setMessages([]);
    setIsSpeaking(false);
  };

  const renderMessage = ({ item }) => (
    <View
      style={[
        styles.messageContainer,
        item.user ? styles.userMessageContainer : styles.aiMessageContainer,
      ]}
    >
      <Text style={[styles.messageText, item.user && styles.userMessage]}>
        {item.text}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => navigation.toggleDrawer()}
        >
          <Icon name="bars" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>GeminiAI Chatbot</Text>
        <TouchableOpacity style={styles.clearButton} onPress={clearMessages}>
          <Icon name="trash" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.flatListContent}
      />
      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.speakerIcon} onPress={toggleSpeech}>
          <Icon
            name={isSpeaking ? "volume-off" : "volume-up"}
            size={24}
            color="white"
            style={styles.icon}
          />
        </TouchableOpacity>
        <TextInput
          placeholder="Type a message"
          onChangeText={setUserInput}
          value={userInput}
          onSubmitEditing={sendMessage}
          style={styles.input}
          placeholderTextColor="#fff"
        />
        <TouchableOpacity style={styles.sendIcon} onPress={sendMessage}>
          <Icon name="send" size={24} color="white" style={styles.icon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffff", marginTop: 50 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#000000",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  menuButton: {
    padding: 10,
  },
  clearButton: {
    padding: 10,
    backgroundColor: "#f44336",
    borderRadius: 25,
  },
  flatListContent: {
    padding: 10,
  },
  messageContainer: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#000000",
    borderRadius: 10,
    marginHorizontal: 10,
  },
  userMessageContainer: {
    backgroundColor: "#333333",
  },
  aiMessageContainer: {
    backgroundColor: "#000000",
  },
  messageText: { fontSize: 16, color: "#ffffff" },
  userMessage: { fontWeight: "bold" },
  inputContainer: { flexDirection: "row", alignItems: "center", padding: 10 },
  input: {
    flex: 1,
    padding: 10,
    backgroundColor: "#131314",
    borderRadius: 10,
    height: 50,
    color: "white",
  },
  speakerIcon: {
    padding: 10,
    backgroundColor: "#131314",
    borderRadius: 25,
    height: 50,
    width: 50,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 5,
  },
  sendIcon: {
    padding: 10,
    backgroundColor: "#131314",
    borderRadius: 25,
    height: 50,
    width: 50,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 5,
  },
  icon: {
    color: "white",
  },
});

export default GeminiChat;
