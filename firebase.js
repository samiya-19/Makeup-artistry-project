import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyChQzmGCzwG7BP6E9BpYORdnb1RflqFzZM",
  authDomain: "glammate-33e8a.firebaseapp.com",
  projectId: "glammate-33e8a",
  storageBucket: "glammate-33e8a.appspot.com",
  messagingSenderId: "1097645753589",
  appId: "1:1097645753589:web:6bb2bbc0ad22b6999eb1bc",
  measurementId: "G-RVS848BDRR"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

