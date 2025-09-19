import { initializeApp } from "firebase/app";
import {getStorage} from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDbeNUZ834Grmlg1GMvP5ypv0rtpY8snBE",
  authDomain: "uploadingvnsim.firebaseapp.com",
  projectId: "uploadingvnsim",
  storageBucket: "uploadingvnsim.appspot.com",
  messagingSenderId: "765365361478",
  appId: "1:765365361478:web:aa1596f261716f6a026347"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);