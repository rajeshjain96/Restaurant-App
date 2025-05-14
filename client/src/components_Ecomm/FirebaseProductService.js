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
async function getProductsFromBackend() {
  const response = await getDocs(collection(db, "products"));
  let list = [];
  response.forEach((doc) => {
    let obj = { ...doc.data() };
    obj.id = doc.id;
    list.push(obj);
  });
  return list;
}
async function getSingleProductFromBackend(id) {
  const docSnap = await getDoc(doc(db, "products", id));
  if (docSnap.exists()) {
    console.log(docSnap.data());
    return docSnap.data();
  } else {
    return null;
  }
}

async function addProductToBackend(product) {
  const docRef = await addDoc(collection(db, "products"), product);
    console.log("Document written with ID: ", docRef.id);
  product.id = docRef.id;
  return product;
}
async function updateBackendProduct(product) {
  const productRef = doc(db, "products", product.id);
  await updateDoc(productRef, product);
}

async function deleteBackendProduct(id) {
  await deleteDoc(doc(db, "products", id));
}
export {
  getProductsFromBackend,
  getSingleProductFromBackend,
  addProductToBackend,
  deleteBackendProduct,
  updateBackendProduct,
};
