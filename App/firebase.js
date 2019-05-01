import RNFirebase from 'react-native-firebase';
// import 'firebase/firestore';
// import 'firebase/auth';

// import React, { Component } from 'react';
// import RNFirebase from 'react-native-firebase';

// const firebase = RNFirebase.initializeApp({
//   apiKey: 'KEY',
//   authDomain: 'APPNAME.firebaseapp.com',
//   databaseURL: 'https://APPNAME-#####.firebaseio.com/',
//   projectId: 'APPNAME-#####'
// });

// export default firebase;

// Initialize Firebase
const config = {
  apiKey: 'AIzaSyCH024S5Y4sfuOqPVUOg3FFTU_nv8WFK0w',
  authDomain: 'think-piece-e87cb.firebaseapp.com',
  databaseURL: 'https://think-piece-e87cb.firebaseio.com',
  projectId: 'think-piece-e87cb',
  storageBucket: 'think-piece-e87cb.appspot.com',
  messagingSenderId: '88207447034',
};
const firebase = RNFirebase.initializeApp(config);

export const firestore = RNFirebase.firestore();
// export const auth = firebase.auth();

// export const provider = new firebase.auth.GoogleAuthProvider();
// export const signInWithGoogle = () => auth.signInWithPopup(provider);
// export const signOut = () => auth.signOut();

// firestore.settings({ timestampsInSnapshots: true });

// export default firebase;
