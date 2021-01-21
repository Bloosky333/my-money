// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDRYZdGum3JmnYSud3Enz_VacjuH2Uilwo",
    authDomain: "my-money-24496.firebaseapp.com",
    projectId: "my-money-24496",
    storageBucket: "my-money-24496.appspot.com",
    messagingSenderId: "1025603372186",
    appId: "1:1025603372186:web:a7af17f6057695d28ccb23"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

const DB = firebase.firestore();
// const ImageStorage = firebase.storage().ref();
const FireAuth = firebase.auth();
FireAuth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
