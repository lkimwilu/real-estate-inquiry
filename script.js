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
      imageUrl: "https://plus.unsplash.com/premium_photo-1689609950112-d66095626efb?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: "property2",
      name: "Luxury Villa",
      imageUrl: "https://plus.unsplash.com/premium_photo-1661876449499-26de7959878f?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: "property3",
      name: "Urban Apartment",
      imageUrl: "https://plus.unsplash.com/premium_photo-1686782502813-51579b55f6d8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: "property4",
      name: "Beachfront Property",
      imageUrl: "https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: "property5",
      name: "Rustic Cabin",
      imageUrl: "https://images.unsplash.com/photo-1647996179012-66b87eba3d17?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: "property6",
      name: "Countryside Estate",
      imageUrl: "https://images.unsplash.com/photo-1605146768851-eda79da39897?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: "property7",
      name: "Skyscraper Condo",
      imageUrl: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: "property8",
      name: "Mountain Chalet",
      imageUrl: "https://images.unsplash.com/photo-1605276373954-0c4a0dac5b12?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: "property9",
      name: "Suburban Home",
      imageUrl: "https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: "property10",
      name: "Penthouse Suite",
      imageUrl: "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ];

  properties.forEach((property) => {
    // Example property item
    const propertyItem = document.createElement("div");
    propertyItem.className = "property-item";
    propertyItem.innerHTML = `
    <div class="property-image">
        <img src="${property.imageUrl}" alt="${property.name}">
        <div class="overlay">Inquire Now</div>
    </div>
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
