// client/src/firebase.js
import { initializeApp } from "firebase/app";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDgLyuaSUxeiDFi6D4ogxFJGLHtQ8rs9_o",
  authDomain: "loopify-e81fc.firebaseapp.com",
  projectId: "loopify-e81fc",
  storageBucket: "loopify-e81fc.appspot.com",
  messagingSenderId: "162115759882",
  appId: "1:162115759882:web:753fd6f36979250e6dd4f3",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, RecaptchaVerifier, signInWithPhoneNumber };
