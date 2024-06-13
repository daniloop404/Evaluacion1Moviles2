import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { getComments, addComment } from '../services/CommentsService';

interface Comment {
  id: string;
  user: string;
  comment: string;
}

export default function HomeScreen() {
  const { logout, userEmail } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [comment, setComment] = useState<string>('');

  useEffect(() => {
    const fetchComments = async () => {
      const fetchedComments = await getComments();
      setComments(fetchedComments);
    };

    fetchComments();
  }, []);

  const handleAddComment = async () => {
    if (comment.trim() !== '') {
      await addComment(userEmail ?? '', comment);
      setComment('');
      const fetchedComments = await getComments();
      setComments(fetchedComments);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Comentarios</Text>
      <Text style={styles.userEmail}>Usuario: {userEmail}</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingrese su comentario"
        value={comment}
        onChangeText={setComment}
      />
      <Button title="Agregar comentario" onPress={handleAddComment} />
      <FlatList
        data={comments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.commentItem}>
            <Text style={styles.commentText}>{item.comment}</Text>
            <Text style={styles.commentUser}>{item.user}</Text>
          </View>
        )}
      />
      <TouchableOpacity style={styles.button} onPress={logout}>
        <Text style={styles.buttonText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  userEmail: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 8,
    marginBottom: 10,
  },
  commentItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  commentText: {
    fontSize: 16,
  },
  commentUser: {
    fontSize: 14,
    color: 'gray',
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