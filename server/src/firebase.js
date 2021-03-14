const firebase = require("firebase");
const dotenv = require("dotenv");

dotenv.config();

// configure firebase
const firebaseConfig = firebase.initializeApp({
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  databaseURL: process.env.DATABASEURL,
  projectId: process.env.PROJECTID,
  storageBucket: process.env.STORAGEBUCKET,
  messagingSenderId: process.env.MESSAGINGSENDERID,
  appId: process.env.APPID,
});

// inialise a create an instance
const database = firebaseConfig.database();

module.exports = database;
