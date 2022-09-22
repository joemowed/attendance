import * as functions from "firebase-functions";
import * as admin from "firebase-admin"
import {UserRecord } from "firebase-functions/v1/auth";



// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
admin.initializeApp(functions.config().firebase);
const dataBase = admin.firestore();
//const auth = admin.auth();
 /*const helloWorld = functions.https.onRequest((request, response) => {
   functions.logger.info("Hello logs!", {structuredData: true});
   response.send("working");
   auth.listUsers().then((userList) =>
   {
    userList.users.forEach((user) => makeUserFBFile(user));
   })
   .catch(() => console.log("ERROR GETTING USERS"))
 });
 */
const onUserSignIn =  functions.auth.user().onCreate((user) =>
{
  makeUserFBFile(user);
});

const makeUserFBFile =(user:UserRecord) => {
  let newDoc ={
    uid: user.uid,
    photoURL: user.photoURL,
    displayName: user.displayName,
    email: user.email,
    emailVerified: user.emailVerified,
    created_UNIX_MILLIS: Date.now()
  }
  dataBase.collection('/USERINFO').doc(user.uid).set(newDoc);
}

export {onUserSignIn,}

