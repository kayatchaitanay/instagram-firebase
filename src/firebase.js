import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyB_xXNGTqwWobqss3QOH2r3HrmS8c35SDQ",
    authDomain: "instaclone-i1.firebaseapp.com",
    projectId: "instaclone-i1",
    storageBucket: "instaclone-i1.appspot.com",
    messagingSenderId: "244628757894",
    appId: "1:244628757894:web:d85b26239c122e3cd46007",
    measurementId: "G-SZPGSMQCSL"
  });

// export default db;

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();  

export {db, auth, storage};