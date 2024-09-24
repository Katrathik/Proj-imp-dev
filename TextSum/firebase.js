import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getAuth} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";
import {getFirestore,getDocs,collection} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "your api key",
  authDomain: "your auth domain",
  projectId: "your project id",
  storageBucket: "your storage bucket id",
  messagingSenderId: "your messagingSenderId",
  appId: "your appId",
  measurementId: "your measurement id"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);

const querySnapshot = await getDocs(collection(db, 'userform'));

export { app, auth,db,querySnapshot };