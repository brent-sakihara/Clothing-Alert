import firebase from 'firebase'

const firebaseConfig = {
    apiKey: "AIzaSyBege1tNzqwS49wVuX6-hoG7SdGDgN_5YY",
    authDomain: "clothing-sales-alert.firebaseapp.com",
    databaseURL: "https://clothing-sales-alert-default-rtdb.firebaseio.com",
    projectId: "clothing-sales-alert",
    storageBucket: "clothing-sales-alert.appspot.com",
    messagingSenderId: "452093824416",
    appId: "1:452093824416:web:9bd5d256c03e2e815ae8c5",
    measurementId: "G-N80BL5322Q"
  };

  const fire = firebase.initializeApp(firebaseConfig);

  export default fire;