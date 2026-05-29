import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyASgtAgxWQGcQgMPreYp4wGqDcGu5U6nX8",
  authDomain: "capstone-9d533.firebaseapp.com",
  projectId: "capstone-9d533",
  storageBucket: "capstone-9d533.firebasestorage.app",
  messagingSenderId: "650039263719",
  appId: "1:650039263719:web:669d87ec497f6328993d42",
  measurementId: "G-X30BH7QYJ3"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();