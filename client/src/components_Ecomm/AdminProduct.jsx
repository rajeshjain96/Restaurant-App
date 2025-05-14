function AdminProduct(props) {
  let { product } = props;
  function handleEditProductButtonClick() {
    props.onEditProductButtonClick(product);
  }
  function handleDeleteProductButtonClick() {
    props.onDeleteProductButtonClick(product);
  }
  product.finalPrice = product.mrp - (product.mrp * product.discount) / 100;
  return (
    // row starts
    <>
      <div className="col-12 col-sm-6 col-lg-3 p-2 container-product">
        <div className="container-product border border-1 p-3 rounded-3 border-danger">
          {product.discount != 0 && (
            <div className=" product-discount rounded-2  p-1">
              {" "}
              {product.discount}% Discount
            </div>
          )}
          <div className=" product-image w-75 my-3 mx-auto text-center">
            <img
              className="img-fluid"
              src={"/images/productImages/" + product.image}
              alt=""
            />
            <div className=" product-name text-center">{product.name}</div>
          </div>
          <div className="product-mrp text-center">
            Rs.
            <span
              className={
                product.discount != 0 ? "text-decoration-line-through" : ""
              }
            >
              {" "}
              {product.mrp}
            </span>{" "}
            {product.discount != 0 ? product.finalPrice : ""} (per{" "}
            {product.unit})
          </div>

          <div className="">
            <button
              className="btn btn-danger"
              onClick={handleEditProductButtonClick}
            >
              <i className="bi bi-pencil-square"></i>{" "}
            </button>{" "}
            <button
              className="btn btn-danger"
              onClick={handleDeleteProductButtonClick}
            >
              <i className="bi bi-trash3"></i>
            </button>
          </div>
          {product.inStock == "no" && (
            <div className="w-100 text-danger">Out of stock</div>
          )}
          {product.inStock == "yes" && (
            <div className="w-100 text-success">In Stock</div>
          )}
          {product.inStock && <div className="w-100 text-danger">&nbsp;</div>}
        </div>
      </div>
    </>
  );
}

export default AdminProduct;
