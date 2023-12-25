const express = require('express');

const fbAdminApp = require('firebase-admin/app');
const fbAdminAuth = require('firebase-admin/auth');

let firebaseAdmin = null;
const getFirebaseAdmin = () => {
  if (firebaseAdmin) {
    return firebaseAdmin;
  }
  firebaseAdmin = fbAdminApp.getApps()[0] ?? fbAdminApp.initializeApp();

  return firebaseAdmin;
};
let auth = null;
const getAuth = () => {
  if (auth) {
    return auth;
  }
  auth = fbAdminAuth.getAuth(getFirebaseAdmin());
  return auth;
};

const app = express();
app.get('/', (req, res) => {
  const auth = getAuth();
  auth
    .createCustomToken('some-identity')
    .then((customToken) => {
      res.redirect(`el-sample://example.com/sign_in?token=${customToken}`);
    })
    .catch((error) => {
      console.log('Error creating custom token:', error);
      res.send('Error creating custom token:' + error);
    });
});

app.listen(3001, () => {
  console.log('http://localhost:3001');
});
