import {auth} from "./firebase.js";
import {createUserWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";

const signupForm = document.getElementById('signupForm');

signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = signupForm['email'].value;
    const password = signupForm['password'].value;

    createUserWithEmailAndPassword(auth,email, password)
        .then((userCredential) => {
            window.location.href = 'index.html';
        })
        .catch((error) => {
            alert(error.message);
        });
});