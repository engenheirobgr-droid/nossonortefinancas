import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDxpiQ5XHzv8jndc5uSUI1qbR3k_C19h4M',
  authDomain: 'nosso-norte-fin.firebaseapp.com',
  projectId: 'nosso-norte-fin',
  storageBucket: 'nosso-norte-fin.firebasestorage.app',
  messagingSenderId: '105922259166',
  appId: '1:105922259166:web:45e0d0b2d9eea2e0363a4f'
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const db = firebase.firestore();
export const APP_ID = 'nosso-norte-fin-v1';
