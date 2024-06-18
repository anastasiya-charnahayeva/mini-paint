import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAbSV1OrNJnwl_PSrUl2qVU0atX63WI8QE",

  authDomain: "mini-paint-ec6e1.firebaseapp.com",

  projectId: "mini-paint-ec6e1",

  storageBucket: "mini-paint-ec6e1.appspot.com",

  messagingSenderId: "1076343304261",

  appId: "1:1076343304261:web:e821f622f914ee3f4d332c",

  measurementId: "G-LDBNWSC847",
};

const app = initializeApp(firebaseConfig);

const fbAuth = getAuth(app);

export default fbAuth;
