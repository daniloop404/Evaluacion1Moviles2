import { firebase } from '../constants/firebaseConfig';

interface Comment {
  id: string;
  user: string;
  comment: string;
}

export const getComments = async (): Promise<Comment[]> => {
  const snapshot = await firebase.firestore().collection('comments').get();
  const comments: Comment[] = snapshot.docs.map(doc => ({
    id: doc.id,
    user: doc.data().user,
    comment: doc.data().comment,
  }));
  return comments;
};

export const addComment = async (user: string, comment: string): Promise<void> => {
  await firebase.firestore().collection('comments').add({
    user,
    comment,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  });
};