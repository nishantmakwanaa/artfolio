import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBbkn86NAs0iCCE6i3dMjxctS-r93_d50s",
  authDomain: "artgallery-4c02e.firebaseapp.com",
  databaseURL: "https://artgallery-4c02e.firebaseio.com",
  projectId: "artgallery-4c02e",
  storageBucket: "artgallery-4c02e.appspot.com",
  messagingSenderId: "955387804026",
  appId: "1:955387804026:web:d9fa5f3954d08b61983ec3",
  measurementId: "G-E986Y4Q017",
};

const app = initializeApp(firebaseConfig);

const database = getDatabase(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, database };
export default app;