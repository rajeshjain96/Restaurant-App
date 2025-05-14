import { useState } from "react";
import BillHeader from "./BillHeader";
import BillProduct from "./BillProduct";
import { addBillToBackend } from "./FirebaseBillService";
import {
  getLastBillNumberFromBackend,
  updateBackendLastBillNumber,
} from "./FirebaseLastBillNumberService";
import { BeatLoader } from "react-spinners";

export default function BillPage(props) {
  let { user } = props;
  let { cartItems } = props;
  let [loadFlag, setLoadFlag] = useState(false);

  function handleAddToCartButtonClick(product) {
    props.onAddToCartButtonClick(product);
  }
  function handleChangeQtyButtonClick(product) {
    props.onChangeQtyButtonClick(product);
  }
  function calculateTotal() {
    let total = 0;
    cartItems.forEach((p, index) => {
      total = total + p.total;
    });
    return total;
  }
  async function handleBillCreateClick() {
    setLoadFlag(true);
    let b = await getLastBillNumberFromBackend();
    let billObj = {};
    let currentBillNumber = b.lastbillnumber + 1;
    billObj.billNumber = currentBillNumber;
    billObj.customer = user.name;
    billObj.date = new Date();
    billObj.amount = calculateTotal();
    billObj.soldProducts = cartItems;
    billObj = await addBillToBackend(billObj);
    b.lastbillnumber = currentBillNumber;
    await updateBackendLastBillNumber(b);
    let billId = billObj.id;
    console.log(billId);
    // clear cartItems
    window.localStorage.setItem("cartItems", JSON.stringify([]));
    let message = `I am ${user.name}. My Bill number is ${currentBillNumber}. Its link is ${window.location}?id=${billId}`;
    setLoadFlag(false);

    window.location =
      "https://api.whatsapp.com/send?phone=9422035020&text=" + message;
  }
  if (loadFlag) {
    return (
      <div className="my-5">
        <BeatLoader size={24} color={"red"} />
      </div>
    );
  }
  return (
    <>
      {cartItems.length != 0 && (
        <div className="text-center my-3">
          <button className="btn btn-success" onClick={handleBillCreateClick}>
            Share Bill on WhatsApp
          </button>
        </div>
      )}
      <div className="mycontainer border border-2 border-black mx-auto p-2">
        <BillHeader user={user} />
        <div className="row fw-bold">
          <div className="col-4 text-center">Product</div>
          <div className="col-4 text-end">Rate</div>
          <div className="col-1 text-center">Quantity</div>
          <div className="col-3 text-end">Total</div>
        </div>
        {cartItems.length != 0 &&
          cartItems.map((product, index) => (
            <div className="row border-1 border-bottom my-2 " key={product.id}>
              <BillProduct
                product={product}
                index={index}
                onAddToCartButtonClick={handleAddToCartButtonClick}
                onChangeQtyButtonClick={handleChangeQtyButtonClick}
              />
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
