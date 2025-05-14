import CartProduct from "./CartProduct";
import Product from "./Product";

export default function CartPage(props) {
  let { user } = props;
  let { cartItems } = props;
  function handleButtonClick(index) {
    props.onButtonClick(index);
  }
  function handleAddToCartButtonClick(product) {
    props.onAddToCartButtonClick(product);
  }
  function handleChangeQtyButtonClick(product) {
    props.onChangeQtyButtonClick(product);
  }
  function handleStartShoppingClick() {
    props.onStartShoppingClick();
  }
  function handleBackToShoppingClick() {
    props.onBackToShoppingClick();
  }
  function handleProceedToBuyClick() {
    props.onProceedToBuyClick();
  }
  return (
    <>
      {cartItems.length != 0 && (
        <div className="text-center my-3">
          <button className="btn btn-dark" onClick={handleBackToShoppingClick}>
            <i class="bi bi-arrow-left-square"></i>
          </button>{" "}
        </div>
      )}
      {cartItems.length != 0 && (
        <div className="text-center my-3">
          <button
            className="btn btn-sm btn-lg  btn-danger"
            onClick={handleProceedToBuyClick}
          >
            Proceed to Buy
          </button>{" "}
        </div>
      )}
      <div className="mycontainer mx-auto">
        {cartItems.length != 0 &&
          cartItems.map((product, index) => (
            <div
              className="row align-items-end align-items-center p-1 my-1 mx-auto border border-3 border-danger "
              key={product.id}
            >
              <CartProduct
                product={product}
                index={index}
                onAddToCartButtonClick={handleAddToCartButtonClick}
                onChangeQtyButtonClick={handleChangeQtyButtonClick}
              />
            </div>
          ))}
      </div>
      {cartItems.length == 0 && (
        <div>
          <div className="text-danger my-3">Cart is Empty. </div>
          <div>
            <button
              className="btn btn-sm btn-lg  btn-danger"
              onClick={handleStartShoppingClick}
            >
              Start Shopping
            </button>{" "}
          </div>
        </div>
      )}
    </>
  );
}
