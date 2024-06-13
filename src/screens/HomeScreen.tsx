import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, FlatList, Modal } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { addComment, getComments, getUserName, deleteComment, updateComment } from '../services/CommentsService'; 

interface Comment {
  userId: string;
  comment: string;
  userEmail: string;
  timestamp: number;
  id: string; // Agrega el ID del comentario
}

export default function HomeScreen() {
  const { logout, userEmail, userId } = useAuth(); 
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // Agrega un estado para indicar si se está editando
  const [editedComment, setEditedComment] = useState(''); // Agrega un estado para el texto editado

  useEffect(() => {
    const fetchComments = async () => {
      const commentsData = await getComments();
      if (commentsData) {
        setComments(commentsData);
      }
    };

    fetchComments();
  }, []);

  const handleCommentChange = (text: string) => {
    setComment(text);
  };

  const handleSubmitComment = async () => {
    if (comment.trim() !== '' && userId && userEmail) { 
      try {
        await addComment(userId, comment, userEmail);
        setComment('');
        // Puedes volver a cargar los comentarios después de agregar uno nuevo
        const commentsData = await getComments();
        if (commentsData) {
          setComments(commentsData);
        }
      } catch (error) {
        console.error("Error al enviar el comentario:", error);
        // ... (manejo de errores)
      }
    }
  };

  const handleDetailsPress = (comment: Comment) => {
    setSelectedComment(comment);
    setEditedComment(comment.comment); // Inicializa el texto editado
    setShowModal(true);
  };


  const closeModal = () => {
    setSelectedComment(null);
    setShowModal(false);
    setIsEditing(false); // Restablece el estado de edición
    setEditedComment(''); // Restablece el texto editado
  };

  const handleDeleteComment = async () => {
    if (selectedComment) {
      try {
        await deleteComment(selectedComment.id); // Pasa el ID del comentario
        // Actualiza la lista de comentarios
        const commentsData = await getComments();
        if (commentsData) {
          setComments(commentsData);
        }
        closeModal();
      } catch (error) {
        console.error("Error al eliminar el comentario:", error);
        // ... (manejo de errores)
      }
    }
  };

  const handleEditComment = () => {
    setIsEditing(true); // Cambia el estado de edición a 'true'
  };

  const handleSaveEdit = async () => {
    if (selectedComment && editedComment) {
      try {
        await updateComment(selectedComment.id, editedComment); // Guarda el comentario editado
        // Actualiza la lista de comentarios
        const commentsData = await getComments();
        if (commentsData) {
          setComments(commentsData);
        }
        closeModal();
      } catch (error) {
        console.error("Error al actualizar el comentario:", error);
        // ... (manejo de errores)
      }
    }
  };

  const handleEditChange = (text: string) => {
    setEditedComment(text);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Comentarios</Text>
      <FlatList
        data={comments}
        keyExtractor={(item) => item.id} 
        renderItem={({ item }) => (
          <View style={styles.commentContainer}>
            <View style={styles.commentContent}> 
              <Text style={styles.commentEmail}>{item.userEmail}:</Text>
              <Text style={styles.commentText}>{item.comment}</Text>
            </View>
            <TouchableOpacity style={styles.detailsButton} onPress={() => handleDetailsPress(item)}>
              <Text style={styles.buttonText}>Detalles</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <View style={styles.userContainer}>
        {userEmail && (
          <Text style={styles.userText}>Usuario: {userEmail}</Text>
        )}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Ingresar comentario"
            value={comment}
            onChangeText={handleCommentChange}
          />
          <TouchableOpacity style={styles.button} onPress={handleSubmitComment}>
            <Text style={styles.buttonText}>Agregar Comentario</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutButton} onPress={logout}>
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal para mostrar detalles del comentario */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showModal}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedComment && (
              <>
                <Text style={styles.modalTitle}>Detalles del Comentario</Text>
                <Text style={styles.modalText}>
                  <Text style={styles.modalTextBold}>Correo Electrónico:</Text> {selectedComment.userEmail}
                </Text>
                {isEditing ? (
                  <TextInput 
                    style={styles.inputModal} 
                    value={editedComment} 
                    onChangeText={handleEditChange} 
                  />
                ) : (
                  <Text style={styles.modalText}>
                    <Text style={styles.modalTextBold}>Comentario:</Text> {selectedComment.comment}
                  </Text>
                )}
                {selectedComment.userId === userId && ( 
                  <>
                    {isEditing ? (
                      <TouchableOpacity style={styles.saveButton} onPress={handleSaveEdit}>
                        <Text style={styles.buttonText}>Guardar</Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity style={styles.editButton} onPress={handleEditComment}>
                        <Text style={styles.buttonText}>Modificar</Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteComment}>
                      <Text style={styles.buttonText}>Eliminar</Text>
                    </TouchableOpacity>
                  </>
                )}
                <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                  <Text style={styles.buttonText}>Cerrar</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'flex-start', 
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  userContainer: {
    alignItems: 'center', 
    marginBottom: 20, 
  },
  userText: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10, 
    paddingHorizontal: 8,
    borderRadius: 5,
    backgroundColor: '#fff',
    width: '80%', 
  },
  button: {
    backgroundColor: '#2196F3',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: '80%', 
  },
  logoutButton: {
    backgroundColor: 'red', 
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
    width: '80%', 
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  commentContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  commentContent: {
    flexDirection: 'column', 
  },
  commentEmail: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  commentText: {
    marginRight: 10, 
  },
  detailsButton: {
    backgroundColor: '#4CAF50', 
    borderRadius: 5,
    padding: 8,
    alignItems: 'center',
    marginLeft: 10, 
  },
  inputContainer: {
    alignItems: 'center', 
    marginBottom: 20, 
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 5,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  modalTextBold: {
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: 'red',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    marginTop: 10, 
  },
  deleteButton: {
    backgroundColor: 'red',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    marginTop: 10, 
  },
  editButton: {
    backgroundColor: '#4CAF50', // Verde para el botón Editar
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    marginTop: 10, 
  },
  saveButton: {
    backgroundColor: '#2196F3', // Azul para el botón Guardar
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    marginTop: 10, 
  },
  inputModal: { // Estilo para el input dentro del modal
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
    borderRadius: 5,
    backgroundColor: '#fff',
    width: '80%',
  }
});