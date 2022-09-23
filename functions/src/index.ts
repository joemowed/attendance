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
  let url = "https://firebasestorage.googleapis.com/v0/b/attandacefb.appspot.com/o/profileimages%2Fdefault.png?alt=media&token=ad5de4b3-83c9-418f-89c3-996644257cec";
  if(user.photoURL)
  {
    url = user.photoURL;

  }
  let newDoc ={
    uid: user.uid,
    photoURL: url,
    displayName: user.displayName,
    email: user.email,
    emailVerified: user.emailVerified,
    created_UNIX_MILLIS: Date.now()
  }
  dataBase.collection('/USERINFO').doc(user.uid).set(newDoc);
}

export {onUserSignIn,}

