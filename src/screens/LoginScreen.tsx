import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../constants/types';
import { useAuth } from '../context/AuthContext';
import { checkUserLoggedIn } from '../services/AuthService';
import { firebase } from '../constants/firebaseConfig'; // Importa firebase

export default function StartScreen() {
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { login } = useAuth();

  useEffect(() => {
    const checkLoginStatus = async () => {
      const isLoggedIn = await checkUserLoggedIn();
      if (isLoggedIn) {
        const user = firebase.auth().currentUser;
        if (user) {
          const userDoc = await firebase.firestore().collection('users').doc(user.uid).get();
          const userData = userDoc.data();
          if (userData) {
            login(userData.email);
            navigation.navigate('Home');
          }
        }
      } else {
        setLoading(false);
      }
    };
    checkLoginStatus();
  }, [navigation, login]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido a la App</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.buttonText}>Iniciar Sesión</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Register')}>
        <Text style={styles.buttonText}>Registrarse</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#2196F3',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});