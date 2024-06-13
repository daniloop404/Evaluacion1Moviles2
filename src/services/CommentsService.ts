import { firebase } from "../constants/firebaseConfig";

export const getUserName = async (userId: string): Promise<string | null> => {
  try {
    const snapshot = await firebase.database().ref(`usuarios/${userId}`).once('value');
    const userData = snapshot.val();
    
    if (userData && userData.email) {
      return userData.email; // Retorna el correo electrónico del usuario
    } else {
      console.error("No se encontró el correo electrónico del usuario.");
      return null;
    }
  } catch (error) {
    console.error("Error al obtener el correo electrónico del usuario:", error);
    return null;
  }
};