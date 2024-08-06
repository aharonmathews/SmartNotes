// GeminiChat.js
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
import Modal from 'react-native-modal';
import Icon from "react-native-vector-icons/FontAwesome";
import FlashMessage, { showMessage } from "react-native-flash-message";

const GeminiChat = ({ navigation }) => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);


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

    const aiMessage = { text, user: false };
    setMessages((prevMessages) => [...prevMessages, aiMessage]);
    setUserInput("");
    setLoading(false);
  };

  const speakMessage = (message) => {
    if (!isSpeaking) {
      setIsSpeaking(true);
      Speech.speak(message, {
        onDone: () => setIsSpeaking(false),
        onStopped: () => setIsSpeaking(false),
      });
    }
  };

  const clearMessages = () => {
    setMessages([]);
  };

  const renderItem = ({ item }) => (
    <View
      style={[
        styles.messageContainer,
        item.user ? styles.userMessage : styles.aiMessage,
      ]}
    >
      <Text style={styles.messageText}>{item.text}</Text>
      <TouchableOpacity
        style={styles.speakButton}
        onPress={() => speakMessage(item.text)}
      >
        <Icon name="volume-up" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
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
          <Icon name="close" size={30} color="#000" />
        </TouchableOpacity>
      </Modal>
      <FlashMessage position="top" />
      <View style={styles.header}>
        <Text style={styles.headerText}>GeminiAI Chatbot</Text>
      </View>
      
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.messagesList}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={userInput}
          onChangeText={setUserInput}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage} disabled={loading}>
          <Icon name="send" size={20} color="#000" />
        </TouchableOpacity>
      </View>
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
    height: '10%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'semibold',
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
  clearButton: {
    padding: 8,
  },
  messagesList: {
    flexGrow: 1,
    paddingTop: 16,
  },
  messageContainer: {
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#ffa368',
    borderRadius: 8,
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#ffa500',
    alignItems:'left',
    width: '90%',
  },
  messageText: {
    fontSize: 16,
    color: '#fff',
  },
  speakButton: {
    marginTop: 8,
    alignItems: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#000',
  },
  input: {
    flex: 1,
    padding: 8,
    borderColor: '#ffa500',
    borderWidth: 1,
    borderRadius: 8,
    marginRight: 8,
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
export default GeminiChat;