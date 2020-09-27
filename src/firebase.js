  
import firebase, { firestore }  from "firebase";

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyDbMd_v3rYtvDNtmmWbE7sQysbcdEHFcDE",
    authDomain: "rpispares-4a4d9.firebaseapp.com",
    databaseURL: "https://rpispares-4a4d9.firebaseio.com",
    projectId: "rpispares-4a4d9",
    storageBucket: "rpispares-4a4d9.appspot.com",
    messagingSenderId: "254112219231",
    appId: "1:254112219231:web:aa5b10c82d598878859bea",
    measurementId: "G-Z0B8P7278M"
});

// console.log("Succesfull")

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };