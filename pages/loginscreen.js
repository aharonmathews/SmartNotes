import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; 

import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { FIREBASE_AUTH } from '../config/firebase';
import { Ionicons } from '@expo/vector-icons';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;

  const signIn = async () => {
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      console.log(response);
      navigation.navigate('LandingPage');
    } catch (error) {
      console.log(error);
      alert('Sign-in failed ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async () => {
    navigation.navigate('CreateAccount');
  };

  

  
  return (
    <View style={styles.container}>
          
        <View style={styles.contentOverlay}>
          <View style={styles.centeredContent}>
            <Text style={styles.title}>Welcome!</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.fieldLabel}>Username:</Text>
              <TextInput
                placeholder="Enter username"
                value={email}
                style={styles.textInput}
                autoCapitalize="none"
                onChangeText={(text) => setEmail(text)}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.fieldLabel}>Password:</Text>
              <TextInput
                placeholder="Enter password"
                onChangeText={(text) => setPassword(text)}
                value={password}
                secureTextEntry={!showPassword}
                style={styles.textInput}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.toggleButton}>
                {showPassword ? <Ionicons name="eye-off" size={24} color="black" /> : <Ionicons name="eye" size={24} color="black" />}
              </TouchableOpacity>
            </View>
            <View style={styles.primaryContainer}>
              <Button title="Login" onPress={signIn} color="transparent" ></Button>
            </View>
            <View style={styles.horizontalContainer}>
              <Text style={styles.dontHaveAccountText}>
                Don't have an account?
              </Text>
              <View style={styles.secondaryContainer}>
                <Button
                  title="Create Account"
                  onPress={signUp}
                  color="transparent"
                  autoCapitalize="false"
                  titleStyle={styles.createAccountText}
                />
                
              </View>
            </View>
          </View>
        </View>
      </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0ffff',
  },
  
  contentOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  centeredContent: {
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    color: '#000',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 10,
  },
  fieldLabel: {
    fontSize: 16,
    color: '#000',
    marginBottom: 5,
    fontWeight:'bold'
  },
  textInput: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    fontSize: 16,
    width: 200,
    borderColor: '#ffa500',
  },
  primaryContainer: {
    backgroundColor: '#000',
    borderRadius: 30,
    overflow: 'hidden',
    width: 200,
    height:40,
    margin:10,
  },
  secondaryContainer: {
    backgroundColor:'#000',
    borderRadius: 30,
    overflow: 'hidden',
    height:36,
    margin:10,
  },
  createAccountText: {
    color: '#fff',
  },
  horizontalContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10, 
  },
  toggleButton: {
    position: 'absolute',
    right: 10,
    bottom:13,
  },
});

export default LoginScreen;
