import { initializeApp } from 'firebase/app';

const firebaseConfig = {
    apiKey: "AIzaSyDsLHBUkdQWgRAwxXnI1cbWB57yxOyCsaM",
    authDomain: "driveteam-rapid-react.firebaseapp.com",
    projectId: "driveteam-rapid-react",
    storageBucket: "driveteam-rapid-react.appspot.com",
    messagingSenderId: "903670858129",
    appId: "1:903670858129:web:a1ea6bb9c235bbc8be1a30",
    measurementId: "G-G4ZV2NE0Y0"
};
  
// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;