import { firebase } from "../constants/firebaseConfig";

interface Comment {
    userId: string;
    comment: string;
    userEmail: string;
    timestamp: number;
    id: string; // Añade la propiedad 'id' aquí
  }
export const getUserName = async (userId: string): Promise<string | null> => {
  try {
    const snapshot = await firebase.database().ref(`usuarios/${userId}`).once('value');
    const userData = snapshot.val();
    
    if (userData && userData.email) {
      return userData.email;
    } else {
      console.error("No se encontró el correo electrónico del usuario.");
      return null;
    }
  } catch (error) {
    console.error("Error al obtener el correo electrónico del usuario:", error);
    return null;
  }
};
export const getComments = async (): Promise<Comment[] | null> => {
    try {
      const snapshot = await firebase.database().ref('comentarios').orderByChild('timestamp').once('value');
      const commentsData = snapshot.val();
  
      if (commentsData) {
        const commentsArray: Comment[] = Object.keys(commentsData).map((commentId) => ({
          ...commentsData[commentId],
          timestamp: commentsData[commentId].timestamp,
          id: commentId // Agrega el ID al comentario
        }));
        return commentsArray.reverse(); 
      } else {
        return []; 
      }
    } catch (error) {
      console.error('Error al obtener los comentarios:', error);
      return null; 
    }
  };

// Nueva función para agregar comentarios
export const addComment = async (userId: string, commentText: string, userEmail: string) => { // Añade userEmail como parámetro
    try {
      const newCommentId = firebase.database().ref().child('comentarios').push().key;
  
      await firebase.database().ref(`comentarios/${newCommentId}`).set({
        userId: userId,
        comment: commentText,
        userEmail: userEmail, // Guarda el correo electrónico
        timestamp: firebase.database.ServerValue.TIMESTAMP 
      });
  
      console.log('Comentario añadido con éxito');
    } catch (error) {
      console.error('Error al añadir el comentario:', error);
    }
  };
  export const deleteComment = async (commentId: string) => {
    try {
      await firebase.database().ref(`comentarios/${commentId}`).remove();
      console.log('Comentario eliminado con éxito');
    } catch (error) {
      console.error('Error al eliminar el comentario:', error);
    }
  };
  export const updateComment = async (commentId: string, newComment: string) => {
    try {
      await firebase.database().ref(`comentarios/${commentId}`).update({
        comment: newComment 
      });
      console.log('Comentario actualizado con éxito');
    } catch (error) {
      console.error('Error al actualizar el comentario:', error);
    }
  };
  

  