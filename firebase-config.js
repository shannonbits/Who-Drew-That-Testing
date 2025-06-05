// Firebase configuration - Replace with your actual config
const firebaseConfig = {
    apiKey: "AIzaSyDpXmJ1S2X5Y9X5Y9X5Y9X5Y9X5Y9X5Y9X5",
    authDomain: "whodrewdat.firebaseapp.com",
    databaseURL: "https://whodrewdat-default-rtdb.firebaseio.com",
    projectId: "whodrewdat",
    storageBucket: "whodrewdat.appspot.com",
    messagingSenderId: "1234567890",
    appId: "1:1234567890:web:abc123def456"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
