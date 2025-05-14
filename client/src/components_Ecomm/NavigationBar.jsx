import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getAuth } from "firebase/auth";

function NavigationBar(props) {
  let { view } = props;
  let { message } = props;
  let { user } = props;
  let { cartItems } = props;
  const provider = new GoogleAuthProvider();
  const auth = getAuth();

  function handleLoginButtonClick() {
    props.onLoginButtonClick();
  }
  function handleLoginUsingGoogleButtonClick() {
    props.onLoginUsingGoogleButtonClick();
  }
  function handleSignupButtonClick() {
    props.onSignupButtonClick();
  }
  function handleLogoutButtonClick() {
    props.onLogoutButtonClick();
  }
  function handleLogoClick() {
    console.log("Logo clicked");
    props.onLogoClick();
  }
  function handleCartClick() {
    props.onCartClick();
  }
  function calculateTotal() {
    let total = 0;
    cartItems.forEach((p, index) => {
      total = total + p.total;
    });
    return total;
  }
  function handleSearchTextChange(event) {
    props.onSearchTextChange(event.target.value);
  }
  return (
    <>
      <div className="row  justify-content-around align-items-center fixed-top bg-danger btn-panel p-2 border-bottom border-3 border-danger">
        <div className="text-center">
          {user && (
            <span className="text-white ">{"Welcome " + user.name + " "}</span>
          )}
        </div>
        <div className="col-3 col-sm-1">
          <div href="#" onClick={handleLogoClick}>
            {" "}
            <img src="/images/shop_logo.jpg" className="img-fluid" alt="" />
          </div>
        </div>
        {/* <div className="col-4 text-end ">
          {!user && (
            <button
              className="btn btn-primary"
              onClick={handleLoginButtonClick}
            >
              Login using Google
            </button>
          )}{" "} */}
        <div className="col-4 myborder col-md-4 text-center">
          {!user && (
            <button
              className="btn btn-light my-1"
              // onClick={handleLoginUsingGoogleButtonClick}
              onClick={handleLoginButtonClick}
            >
              Login
            </button>
          )}{" "}
          {!user && (
            <button className="btn btn-light" onClick={handleSignupButtonClick}>
              Signup
            </button>
          )}{" "}
          {user && (
            <div className="my-1">
              <button
                className="btn btn-sm btn-lg btn-light"
                onClick={handleLogoutButtonClick}
              >
                Logout
              </button>
            </div>
          )}{" "}
        </div>
        {(!user || user.role == "user") && (
          <div
            className="col-3 col-md-1 myborder bg-white"
            onClick={handleCartClick}
          >
            <div>
              <span className="container-cart">
                <i className="bi bi-cart3"></i>{" "}
              </span>
              {cartItems.length != 0 && (
                <span className="bg-danger rounded-5 text-white">
                  &nbsp;{cartItems.length}&nbsp;
                </span>
              )}
            </div>
            {calculateTotal() != 0 && (
              <div>
                <i className="bi bi-currency-rupee"></i> {calculateTotal()}
              </div>
            )}
          </div>
        )}

        {(!user ||
          (user.role == "user" && view == "productsPage") ||
          user.role == "admin") && (
          <div className="search-product my-1 ">
            <input
              type="search"
              name=""
              id=""
              size="50"
              placeholder=" Search a product"
              onChange={handleSearchTextChange}
              className="p-1"
            />
          </div>
        )}
        {message && <div className="text-white">{message}</div>}
      </div>
      {/* row ends */}
    </>
  );
}

export default NavigationBar;
