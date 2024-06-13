import React, { useEffect } from 'react'; 
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import StartScreen from './src/screens/StartScreen';
import { RootStackParamList } from './src/constants/types';
import { View, ActivityIndicator } from 'react-native';



const Stack = createStackNavigator<RootStackParamList>();

function AppNavigator() {
  const { isLoggedIn, isLoading, logout } = useAuth(); // Importa logout

  if (isLoading) {
    return ( 
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} /> 

      {/* Estas pantallas se muestran solo si el usuario NO está autenticado */}
      {!isLoggedIn && (
        <>
          <Stack.Screen name="Start" component={StartScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}