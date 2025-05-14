function BillProduct(props) {
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
      <div className="col-4 myborder product-name text-start ">
        {index + 1}. {product.name}
      </div>
      <div className=" col-4 product-mrp text-end">
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
      <div className="col-1 text-center">
        <div className="">{product.qty}</div>
      </div>

      {product.qty > 0 && (
        <div className="col-3 text-end">{product.total.toFixed(2)}</div>
      )}
    </>
  );
}

export default BillProduct;
