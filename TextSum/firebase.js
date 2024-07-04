import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getAuth} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";
import {getFirestore,getDocs,collection} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "your api key here",
    authDomain: "your api domain here",
    projectId: "your projectId",
    storageBucket: "your storage bucket here",
    messagingSenderId: "your messaging sender id here",
    appId: "your app id here",
    measurementId: "your measurement id here"
  };


const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);

const querySnapshot = await getDocs(collection(db, 'userform'));

export { app, auth,db,querySnapshot };