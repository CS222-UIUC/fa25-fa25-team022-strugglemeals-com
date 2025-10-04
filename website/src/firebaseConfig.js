
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBLhEbClNGQphmNbVbcaoYR3O8eBBiEuLU",
  authDomain: "strugglemeals-71894.firebaseapp.com",
  projectId: "strugglemeals-71894",
  storageBucket: "strugglemeals-71894.firebasestorage.app",
  messagingSenderId: "130468782071",
  appId: "1:130468782071:web:da7f4711d40a9045fb58f2",
  measurementId: "G-ZRDLD5PN5X"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);