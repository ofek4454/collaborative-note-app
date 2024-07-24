import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBkoAg_m8rEP2gBEvKjoj-PEVZVeIEpmXY",
  authDomain: "collaborative-note-app-59eeb.firebaseapp.com",
  projectId: "collaborative-note-app-59eeb",
  storageBucket: "collaborative-note-app-59eeb.appspot.com",
  messagingSenderId: "689320772312",
  appId: "1:689320772312:web:eb471fbf182c17a6cd4dad",
  measurementId: "G-S9M7FGWQWS",
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };

/**
 * To deplow website to Firebase Hosting:
 * >> firebase login
 * >> firebase init
 * >> firebase deploy
 */
