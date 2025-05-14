import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";
async function getBillsFromBackend() {
  const response = await getDocs(collection(db, "bills"));
  let list = [];
  response.forEach((doc) => {
    let obj = { ...doc.data() };
    obj.id = doc.id;
    list.push(obj);
  });
  return list;
}
async function getSingleBillFromBackend(id) {
  const docSnap = await getDoc(doc(db, "bills", id));
  if (docSnap.exists()) {
    console.log(docSnap.data());
    return docSnap.data();
  } else {
    return null;
  }
}
async function addBillToBackend(bill) {
  const docRef = await addDoc(collection(db, "bills"), bill);
  //   console.log("Document written with ID: ", docRef.id);
  bill.id = docRef.id;
  return bill;
}
async function updateBackendBill(bill) {
  const productRef = doc(db, "bills", bill.id);
  await updateDoc(productRef, bill);
}

async function deleteBackendBill(id) {
  await deleteDoc(doc(db, "bills", id));
}
export {
  getBillsFromBackend,
  getSingleBillFromBackend,
  addBillToBackend,
  deleteBackendBill,
  updateBackendBill,
};
