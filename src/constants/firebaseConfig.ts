import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';
import 'firebase/compat/storage';

const firebaseConfig = {
    apiKey: "AIzaSyDWOYpoTvoruaTv2kIKJX-14F7MU_sUzZI",
    authDomain: "evaluacion1-424ed.firebaseapp.com",
    projectId: "evaluacion1-424ed",
    storageBucket: "evaluacion1-424ed.appspot.com",
    messagingSenderId: "7064922089",
    appId: "1:7064922089:web:5c27e5979cbb51332a8d78"
  };

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export { firebase };