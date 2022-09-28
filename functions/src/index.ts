import * as functions from "firebase-functions";
import * as admin from "firebase-admin"
import {UserRecord } from "firebase-functions/v1/auth";



// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
admin.initializeApp(functions.config().firebase);
const dataBase = admin.firestore();

//  const helloWorld = functions.https.onRequest((request, response) => {
//    functions.logger.info("Hello logs!", {structuredData: true});
//    response.send("working");
//    auth.listUsers().then((userList) =>
//    {
//     userList.users.forEach((user) => makeUserFBFile(user));
//    })
//    .catch(() => console.log("ERROR GETTING USERS"))
//  });
 
const onUserSignIn =  functions.auth.user().onCreate((user) =>
{
  makeUserFBFile(user);
  return;
});
// const onCollectionCreate = functions.firestore.document('/{combinedID}').onCreate((change,context)=>{
//   const uid1 = context.params.combinedID.slice(0,28);
//   const uid2 = context.params.combinedID.slice(28,56);
//   const uid1Ref = dataBase.collection('/USERINFO').doc(uid1);
//   const uid2Ref = dataBase.collection('/USERINFO').doc(uid2);
//   uid1Ref.update({privateMessagePartners: admin.firestore.FieldValue.arrayUnion(uid2)})
//   uid2Ref.update({privateMessagePartners: admin.firestore.FieldValue.arrayUnion(uid1)})
// });
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
    privateMessagePartners: [] as string[],
    created_UNIX_MILLIS: Date.now()
  }
  dataBase.collection('/USERINFO').doc(user.uid).set(newDoc);
}

//returns a name of a registered user given a uid as a request
//request format:  text "USER_ID"
//response format: text "USER_DISPLAY_NAME"

export {onUserSignIn}

