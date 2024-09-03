// app.js
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDWojX87n3VG7ycoAPyokILtl9FHAhDtEs",
  authDomain: "real-estate-inquiry.firebaseapp.com",
  projectId: "real-estate-inquiry",
  storageBucket: "real-estate-inquiry.appspot.com",
  messagingSenderId: "239778096082",
  appId: "1:239778096082:web:9e22b15fb7d72230b4de0b",
  measurementId: "G-BW5DRHHBE6",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// References
const auth = firebase.auth();
const db = firebase.firestore();



// User Signup
document.getElementById('signup-btn').addEventListener('click', () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            alert('User signed up!');
        })
        .catch((error) => {
            alert(error.message);
        });
});

// User Login
document.getElementById('login-btn').addEventListener('click', () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            document.getElementById('login-container').classList.add('hidden');
            document.getElementById('inquiry-form-container').classList.remove('hidden');
            document.getElementById('inquiries-container').classList.remove('hidden');
            loadInquiries(userCredential.user.uid);
        })
        .catch((error) => {
            alert(error.message);
        });
});


// Submit Inquiry
document.getElementById('submit-inquiry-btn').addEventListener('click', () => {
    const propertyId = document.getElementById('property-id').value;
    const inquiryMessage = document.getElementById('inquiry-message').value;
    const user = auth.currentUser;

    if (user) {
        db.collection('inquiries').add({
            userId: user.uid,
            propertyId: propertyId,
            message: inquiryMessage,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(() => {
            alert('Inquiry submitted!');
            loadInquiries(user.uid);
        })
        .catch((error) => {
            alert(error.message);
        });
    }
});
