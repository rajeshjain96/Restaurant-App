import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";
async function getUsersFromBackeend() {
  const response = await getDocs(collection(db, "users"));
  let list = [];
  response.forEach((doc) => {
    let obj = { ...doc.data() };
    obj.id = doc.id;
    list.push(obj);
  });
  return list;
}
async function addUserToBackend(user) {
  const docRef = await addDoc(collection(db, "users"), user);
  //   console.log("Document written with ID: ", docRef.id);
  user.id = docRef.id;
  return user;
}
async function updateBackendUser(user) {
  const productRef = doc(db, "users", user.id);
  await updateDoc(productRef, user);
}

async function deleteBackendUser(id) {
  await deleteDoc(doc(db, "users", id));
}
export {
    getUsersFromBackeend,
  addUserToBackend,
  deleteBackendUser,
  updateBackendUser,
};
