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
    const { displayName, email, photoUrl } = user;
    try {
      await userRef.set({
        displayName,
        email,
        // photoUrl,
        createdAt,
        ...additionalData,
      });
    } catch (error) {
      console.error('Error creating user', error.message);
    }
  }
  return getUserDocument(user.uid);
};
