import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import { getFirestore, collection, addDoc, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

// Your web app's Firebase configuration
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
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Elements
const signupContainer = document.getElementById("signup-container");
const loginContainer = document.getElementById("login-container");
const inquiryFormContainer = document.getElementById("inquiry-form-container");
const propertyListContainer = document.getElementById(
  "property-list-container"
);
const inquiriesContainer = document.getElementById("inquiries-container");
const propertyList = document.getElementById("property-list");

// Event listeners to toggle between login and signup forms
document.getElementById("show-login-btn").addEventListener("click", () => {
  signupContainer.classList.add("hidden");
  loginContainer.classList.remove("hidden");
});

document.getElementById("show-signup-btn").addEventListener("click", () => {
  loginContainer.classList.add("hidden");
  signupContainer.classList.remove("hidden");
});

// Signup event listener
document.getElementById("signup-btn").addEventListener("click", async () => {
    const firstName = document.getElementById("first-name").value;
    const lastName = document.getElementById("last-name").value;
    const gender = document.getElementById("gender").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
  
    if (firstName && lastName && gender && email && password) {
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;
        console.log("User signed up: ", user);
  
        // Store additional user details in Firestore
        await setDoc(doc(db, "users", user.uid), {
          firstName: firstName,
          lastName: lastName,
          gender: gender,
          email: email,
        });
  
        alert("Signup successful! Please login.");
        document.getElementById("signup-container").classList.add("hidden");
        document.getElementById("login-container").classList.remove("hidden");
      } catch (error) {
        console.error("Error signing up: ", error);
        alert("Error signing up. Please try again.");
      }
    } else {
      alert("Please fill out all fields.");
    }
  });
// Login functionality
document.getElementById("login-btn").addEventListener("click", () => {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      console.log("User logged in: ", userCredential.user);
      loginContainer.classList.add("hidden");
      propertyListContainer.classList.remove("hidden");
      loadProperties(); // Load properties when the user is authenticated
    })
    .catch((error) => {
      console.error("Error logging in: ", error);
      alert("Error logging in: " + error.message);
    });
});

// Authentication state observer
onAuthStateChanged(auth, (user) => {
  if (user) {
    loginContainer.classList.add("hidden");
    signupContainer.classList.add("hidden");
    propertyListContainer.classList.remove("hidden");
    loadProperties(); // Load properties when the user is authenticated
  } else {
    signupContainer.classList.remove("hidden");
    loginContainer.classList.add("hidden");
    propertyListContainer.classList.add("hidden");
    inquiryFormContainer.classList.add("hidden");
  }
});

// Load properties dynamically
async function loadProperties() {
  // Example properties with Unsplash images
  const properties = [
    {
      id: "property1",
      name: "Modern House",
      imageUrl: "https://source.unsplash.com/1600x900/?house,modern",
    },
    {
      id: "property2",
      name: "Luxury Villa",
      imageUrl: "https://source.unsplash.com/1600x900/?villa,luxury",
    },
    {
      id: "property3",
      name: "Urban Apartment",
      imageUrl: "https://source.unsplash.com/1600x900/?apartment,urban",
    },
    {
      id: "property4",
      name: "Beachfront Property",
      imageUrl: "https://source.unsplash.com/1600x900/?beach,house",
    },
    {
      id: "property5",
      name: "Rustic Cabin",
      imageUrl: "https://source.unsplash.com/1600x900/?cabin,rustic",
    },
    {
      id: "property6",
      name: "Countryside Estate",
      imageUrl: "https://source.unsplash.com/1600x900/?estate,countryside",
    },
    {
      id: "property7",
      name: "Skyscraper Condo",
      imageUrl: "https://source.unsplash.com/1600x900/?condo,skyscraper",
    },
    {
      id: "property8",
      name: "Mountain Chalet",
      imageUrl: "https://source.unsplash.com/1600x900/?chalet,mountain",
    },
    {
      id: "property9",
      name: "Suburban Home",
      imageUrl: "https://source.unsplash.com/1600x900/?suburban,home",
    },
    {
      id: "property10",
      name: "Penthouse Suite",
      imageUrl: "https://source.unsplash.com/1600x900/?penthouse,suite",
    },
  ];

  properties.forEach((property) => {
    const propertyItem = document.createElement("div");
    propertyItem.className = "property-item";
    propertyItem.innerHTML = `
            <img src="${property.imageUrl}" alt="${property.name}">
            <p>${property.name}</p>
        `;

    propertyItem.addEventListener("click", () => {
      // Display the inquiry form
      inquiryFormContainer.classList.remove("hidden");
      inquiriesContainer.classList.add("hidden");
      document.getElementById("property-id").value = property.id;
    });

    propertyList.appendChild(propertyItem);
  });
}

// Submit inquiry
document
  .getElementById("submit-inquiry-btn")
  .addEventListener("click", async () => {
    const propertyId = document.getElementById("property-id").value;
    const inquiryMessage = document.getElementById("inquiry-message").value;
    const user = auth.currentUser;

    if (user && propertyId && inquiryMessage) {
      try {
        await addDoc(collection(db, "inquiries"), {
          userId: user.uid,
          propertyId: propertyId,
          message: inquiryMessage,
          timestamp: new Date(),
        });
        alert("Inquiry submitted successfully");
      } catch (error) {
        console.error("Error submitting inquiry: ", error);
      }
    } else {
      alert("Please fill out the inquiry form completely.");
    }
  });
