import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; 

const firebaseConfig = {
  apiKey: "AIzaSyDUWZQp7u-MI3fxDaIeohNDr7vmy7mUIR4",
  authDomain: "recipes-394c2.firebaseapp.com",
  projectId: "recipes-394c2",
  storageBucket: "recipes-394c2.appspot.com",
  messagingSenderId: "83409877153",
  appId: "1:83409877153:web:68763b948cbd823c12d8e0",
  measurementId: "G-YKQLZJCXYM"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const db = getFirestore(app);

export { db }