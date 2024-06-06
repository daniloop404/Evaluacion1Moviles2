import { firebase } from "../constants/firebaseConfig";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const registerUser = async (email: string, password: string) => {
  try {
    const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;

    if (user) {
      return { success: true, user };
    }
  } catch (error) {
    if (error instanceof Error && (error as any).code) { 
      let errorMessage = 'An unknown error occurred';

      switch ((error as any).code) {
        case 'auth/email-already-in-use':
          errorMessage = 'El correo electrónico ya está siendo utilizado por otra cuenta.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'El correo electrónico proporcionado no es válido.';
          break;
        case 'auth/operation-not-allowed':
          errorMessage = 'La operación no está permitida.';
          break;
        case 'auth/weak-password':
          errorMessage = 'La contraseña debe tener al menos 6 caracteres.';
          break;
        case 'auth/invalid-credential':
          errorMessage = 'Las credenciales proporcionadas son incorrectas, están mal formadas o han expirado.';
          break;
        default:
          errorMessage = (error as any).message;
      }

      return { success: false, error: errorMessage };
    }
    return { success: false, error: 'An unknown error occurred' };
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
    const user = userCredential.user;

    if (user) {
      await AsyncStorage.setItem('userToken', user.uid);
      return { success: true, user };
    }
  } catch (error) {
    if (error instanceof Error && (error as any).code) {
      let errorMessage = 'An unknown error occurred';

      switch ((error as any).code) {
        case 'auth/user-not-found':
          errorMessage = 'No se encontró un usuario con este correo electrónico.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'La contraseña es incorrecta.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'El correo electrónico proporcionado no es válido.';
          break;
        case 'auth/invalid-credential':
          errorMessage = 'Las credenciales proporcionadas son incorrectas, están mal formadas o han expirado.';
          break;
        default:
          errorMessage = (error as any).message;
      }

      return { success: false, error: errorMessage };
    }
    return { success: false, error: 'An unknown error occurred' };
  }
};

export const logoutUser = async () => {
  try {
    await firebase.auth().signOut();
    await AsyncStorage.removeItem('userToken'); // Eliminar el token al cerrar sesión
  } catch (error) {
    // manejo de errores
  }
};

export const checkUserLoggedIn = async () => {
  const userToken = await AsyncStorage.getItem('userToken');
  return userToken !== null;
};