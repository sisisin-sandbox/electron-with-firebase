// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyACuGbIJyGD6g-45j0PStbGsmvgHcotSzk',
  authDomain: 'sisisin-sandbox.firebaseapp.com',
  projectId: 'sisisin-sandbox',
  storageBucket: 'sisisin-sandbox.appspot.com',
  messagingSenderId: '481457499283',
  appId: '1:481457499283:web:8ec5354bcd935c7814b166',
  measurementId: 'G-65LM17QKSQ',
};

export const fbApp = initializeApp(firebaseConfig);
export const fbAuth = getAuth(fbApp);
