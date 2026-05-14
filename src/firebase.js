import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCghOlLjN050hx7P1DQ-isAAO8xQpPHyaQ",
  authDomain: "smartims-c82d6.firebaseapp.com",
  projectId: "smartims-c82d6",
  storageBucket: "smartims-c82d6.firebasestorage.app",
  messagingSenderId: "265384823556",
  appId: "1:265384823556:web:1859e6bf466a9e47cd1e51",
  measurementId: "G-Q1373FEQVD"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export default app;