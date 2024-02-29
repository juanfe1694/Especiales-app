import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBOmVEGU2ZDfeeCR5H5RxBep0rd5enxpAU",
  authDomain: "especiales-app.firebaseapp.com",
  projectId: "especiales-app",
  storageBucket: "especiales-app.appspot.com",
  messagingSenderId: "173297199687",
  appId: "1:173297199687:web:22a355cc41bb5bfc11df62",
  measurementId: "G-K8PDB0Y2G8",
  databaseURL: "https://especiales-app-default-rtdb.firebaseio.com",
};

// Initialize Firebase
export const firebase = initializeApp(firebaseConfig);
export const rtdb = getDatabase(firebase);

