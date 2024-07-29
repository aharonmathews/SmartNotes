import { StatusBar } from 'expo-status-bar';

import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LandingPage from './pages/landingpage'
import ChatBot from './pages/chatbot'
import LoginScreen from './pages/loginscreen'
import CreateAccount from './pages/createaccount'
import ChangePassword from './pages/changepassword'
import AddNote from './pages/addnote'
import NoteDetails from './pages/notedetails'

import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';

const Stack = createNativeStackNavigator();

AppRegistry.registerComponent(appName, () => App);

export default function() {

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginScreen">
        <Stack.Screen name="LandingPage" component={LandingPage} options={{headerShown:false}}/>
        <Stack.Screen name="LoginScreen" component={LoginScreen} options={{headerShown:false}}/>
        <Stack.Screen name="ChatBot" component={ChatBot} options={{headerShown: false}}/>
        <Stack.Screen name="CreateAccount" component={CreateAccount} options={{headerShown: false}}/>
        <Stack.Screen name="AddNote" component={AddNote} options={{headerShown: false}}/>
        <Stack.Screen name="NoteDetails" component={NoteDetails} options={{headerShown: false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
