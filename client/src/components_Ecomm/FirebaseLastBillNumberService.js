import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
async function getLastBillNumberFromBackend() {
  const response = await getDocs(collection(db, "lastBillNumber"));
  let list = [];
  response.forEach((doc) => {
    let obj = { ...doc.data() };
    obj.id = doc.id;
    list.push(obj);
  });
  return list[0];
}

async function updateBackendLastBillNumber(lastBillNumber) {
  const lastBillNumberRef = doc(db, "lastBillNumber", lastBillNumber.id);
  await updateDoc(lastBillNumberRef, lastBillNumber);
}
export { getLastBillNumberFromBackend, updateBackendLastBillNumber };
