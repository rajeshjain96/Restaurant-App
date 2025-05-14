function Product(props) {
  let { product } = props;
  function handleAddToCartButtonClick() {
    product.qty = 1;
    if (product.discount != 0) {
      product.total = product.qty * product.finalPrice;
    } else {
      product.total = product.qty * product.mrp;
    }
    props.onAddToCartButtonClick(product);
  }
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
    <div className="col-6 col-lg-3 p-2 container-product">
      <div className="container-product border border-1 p-3 rounded-3 border-danger">
        {product.discount != 0 && (
          <div className=" product-discount rounded-2  p-1">
            {" "}
            {product.discount}% Discount
          </div>
        )}
        <div className=" product-image  my-3 mx-auto text-center">
          <img
            className="img-fluid"
            src={"/images/fruits/" + product.image}
            alt=""
          />
          <div className=" product-name text-center">{product.name}</div>
        </div>
        <div className="product-mrp text-center">
          <i className="bi bi-currency-rupee"></i>
          <span
            className={
              product.discount != 0 ? "text-decoration-line-through" : ""
            }
          >
            {" "}
            {product.mrp}
          </span>{" "}
          {product.discount != 0 ? product.finalPrice : ""} (per {product.unit})
        </div>
        {product.inStock == "no" && (
          <div className="w-100">
            <button className="btn btn-sm btn-lg w-100 btn-secondary">Out of stock</button>
          </div>
        )}
        {product.qty == 0 && product.inStock == "yes" && (
          <div className="w-100">
            <button
              className="btn btn-sm btn-lg w-100 btn-danger"
              onClick={handleAddToCartButtonClick}
            >
              Add to Cart
            </button>
          </div>
        )}
        {product.qty != 0 && (
          <div className="row align-items-center">
            <div className="col-4">
              <button
                className="btn btn-sm btn-lg btn-danger w-100 font-weight-bold"
                onClick={() => handleChangeQtyButtonClick("-")}
              >
                -
              </button>
            </div>
            <div className="col-4">{product.qty}</div>
            <div className="col-4">
              <button
                className="btn btn-danger w-100"
                onClick={() => handleChangeQtyButtonClick("+")}
              >
                +
              </button>
            </div>
          </div>
        )}
        {product.qty > 0 && (
          <div className="text-center">Rs. {product.total}</div>
        )}
        {product.qty == 0 && (
          <div className="text-center text-danger">&nbsp;</div>
        )}
      </div>
    </div>
  );
}

export default Product;
