import firebase from 'react-native-firebase';

const firestore = firebase.firestore();

export const getUserDocument = async uid => {
  if (!uid) return null;
  try {
    const userDocument = await firestore.collection('users').doc(uid);

    return { uid, ...userDocument.data };
  } catch (error) {
    console.error('Error fetchign user', error.message);
  }
};

export const createUserProfileDocument = async (user, additionalData) => {
  if (!user) return;

  // Get a reference to the place in the database where a user profile might be.
  const userRef = firestore.doc(`users/${user.uid}`);

  // Go and fetch the document from that location.
  const snapshot = await userRef.get();

  if (!snapshot.exists) {
    const createdAt = new Date();
    const { displayName, email } = user;
    try {
      await userRef.set({
        displayName,
        email,
        createdAt,
        // ...additionalData,
      });
    } catch (error) {
      console.error('Error creating user', error.message);
    }
  }
  return getUserDocument(user.uid);
};

export const firebaseError = error => {
  console.log(error.code);
  if (error.code === 'auth/invalid-email') {
    return 'Please enter a valid email address.';
  }
  if (error.code === 'auth/user-not-found') {
    return 'Email has not been registered.';
  }
  if (error.code === 'auth/wrong-password') {
    return 'Password is not valid.';
  }
  if (error.code === 'auth/weak-password') {
    return 'Password requries 6 characters minimum.';
  }
  return error.message;
};
