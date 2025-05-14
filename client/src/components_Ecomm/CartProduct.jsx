function CartProduct(props) {
  let { product } = props;
  let { index } = props;

  function handleChangeQtyButtonClick(op) {
    if (op == "+") {
      product.qty++;
    } else if (op == "-") {
      product.qty--;
    }
    if (product.discount != 0) {
      product.total = product.qty * product.finalPrice;
    } else {
      product.total = product.qty * product.mrp;
    }
    props.onChangeQtyButtonClick(product);
  }
  product.finalPrice = product.mrp - (product.mrp * product.discount) / 100;

  return (
    // row starts
    <>
      <div className="col-1">{index + 1}.</div>
      <div className="col-5 product-name text-start fw-bold my-2 ">{product.name}</div>
      <div className=" col-6 product-mrp text-end">
        Rs.
        <span
          className={
            product.discount != 0 ? "text-decoration-line-through" : ""
          }
        >
          {" "}
          {product.mrp}
        </span>{" "}
        {product.discount != 0 ? product.finalPrice : ""}{" "}
      </div>
      <div className="col-4">
        <div className="d-flex justify-content-between align-items-center">
          <button
            className="btn btn-danger font-weight-bold"
            onClick={() => handleChangeQtyButtonClick("-")}
          >
            -
          </button>
          <div className="">{product.qty}</div>
          <button
            className="btn btn-danger"
            onClick={() => handleChangeQtyButtonClick("+")}
          >
            +
          </button>
        </div>
      </div>

      {product.qty > 0 && (
        <div className="col-8 text-end">Rs. {product.total}</div>
      )}
    </>
  );
}

export default CartProduct;
