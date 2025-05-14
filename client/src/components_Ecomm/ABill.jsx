import { useEffect, useState } from "react";

import {
  addBillToBackend,
  getSingleBillFromBackend,
} from "./FirebaseBillService";
import { getLastBillNumberFromBackend } from "./FirebaseLastBillNumberService";
import ABillHeader from "./ABillHeader";
import { BeatLoader } from "react-spinners";
import firebase from "firebase/compat/app";
import BillProduct from "./BillProduct";

export default function ABill(props) {
  //   let { user } = props;
  //   let { cartItems } = props;
  // let [bill, setBill] = useState("");
  // let [bill, setBill]=useState("");
  let { bill } = props;
  // let [loadFlag, setLoadFlag] = useState(true);

  let user = "";
  let cartItems = [];
  useEffect(() => {
    // let params = new URLSearchParams(window.location.search);
    // let billId = params.get("id");
    // getBill(billId);
    console.log(props.bill);
  }, []);
  async function getBill(billId) {
    setLoadFlag(true);
    let b = await getSingleBillFromBackend(billId);
    // console.log(bill.date);
    //conversion from Firebase timestamp to JS time
    // bill.date = firebase.firestore.Timestamp.fromDate(bill.date).toDate();
    // console.log(bill.date);
    // bill.date=new Date(firestoreTimestamp.toDate());
    b.date = new Date(b.date.toDate());
    console.log(b.date);
    console.log(bill.soldProducts);

    setBill(b);
    setLoadFlag(false);
  }
  function handleButtonClick(index) {
    props.onButtonClick(index);
  }
  function handleAddToCartButtonClick(product) {
    props.onAddToCartButtonClick(product);
  }
  function handleChangeQtyButtonClick(product) {
    props.onChangeQtyButtonClick(product);
  }
  function calculateTotal() {
    let total = 0;
    bill.soldProducts.forEach((p, index) => {
      total = total + p.total;
    });
    return total;
  }
  function handleShareOnWhatsApp() {}
  async function handleBillCreateClick() {
    let b = await getLastBillNumberFromBackeend();
    console.log(b.lastbillnumber);
    let lastbillnumber = b.lastbillnumber;
    let billObj = {};
    billObj.billNumber = lastbillnumber + 1;
    billObj.customer = user.name;
    billObj.date = new Date();
    billObj.amount = calculateTotal();
    billObj.soldProducts = cartItems;
    console.log(billObj);
    billObj = await addBillToBackend(billObj);
    let billId = billObj.id;
    console.log(billId);
    let message = `I am ${user.name}. My Bill number is ${
      lastbillnumber + 1
    }. Its link is ${window.location}?id=${billId}`;
    console.log(message);

    window.location =
      "https://api.whatsapp.com/send?phone=9422035020&text=" + message;
  }
  function handleStartShoppingAgain() {
    props.onStartShoppingAgain();
    w;
  }
  if (bill == null) {
    return (
      <>
        <div className="my-5 text-danger">Error! Invalid Link !!</div>
        <div className="text-center my-3">
          <button className="btn btn-danger" onClick={handleStartShoppingAgain}>
            Start Shopping Again
          </button>
        </div>
      </>
    );
  }
  return (
    <>
      <div className="text-center my-3">
        <button className="btn btn-danger" onClick={handleStartShoppingAgain}>
          Start Shopping Again
        </button>
      </div>

      <div className="mycontainer border border-2 border-black mx-auto p-2">
        <ABillHeader bill={bill} />
        <div className="row fw-bold">
          <div className="col-4 text-center">Product</div>
          <div className="col-4 text-end">Rate</div>
          <div className="col-1 text-center">Quantity</div>
          <div className="col-3 text-end">Total</div>
        </div>
        {bill.soldProducts.length != 0 &&
          bill.soldProducts.map((product, index) => (
            <div className="row border-1 border-bottom my-2 " key={product.id}>
              <BillProduct product={product} index={index} />
            </div>
          ))}
        <div className="row">
          <div className="offset-6 col-3 text-end fw-bold">Grand-Total</div>
          <div className="col-3 fw-bold text-end ">
            Rs. {calculateTotal().toFixed(2)}
          </div>
        </div>
      </div>
    </>
  );
}
