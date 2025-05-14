import { useEffect, useState } from "react";
import NavigationBar from "./NavigationBar";
import ProductsPage from "./ProductsPage";
import { BeatLoader } from "react-spinners";
import LoginPage from "./LoginPage";
import SignupPage from "./SignupPage";
import AdminProducts from "./AdminProducts";
import CartPage from "./CartPage";
import BillPage from "./BillPage";
// import { getProductsFromBackend } from "./FirebaseProductService";
import {
  GoogleAuthProvider,
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
} from "firebase/auth";
import ABill from "./ABill";
import { getSingleBillFromBackend } from "./FirebaseBillService";
import axios from "axios";

function EComm() {
  let [productList, setProductList] = useState([]);
  let [filteredProductList, setFilteredProductList] = useState([]);
  let [loadFlag, setLoadFlag] = useState(true);
  let [cartItems, setCartItems] = useState([]);
  let [cartItemsTotalAmount, setCartItemsTotalAmount] = useState(0);
  let [view, setView] = useState("");
  let [adminView, setAdminView] = useState("list");
  let [apiUrl, setApiUrl] = useState("http://localhost:3000/fruits");
  let [user, setUser] = useState("");
  let [message, setMessage] = useState("");
  let [adminProduct, setAdminProduct] = useState("");
  let [searchTarget, setsearchTarget] = useState("");
  let [bill, setBill] = useState(null);
  const provider = new GoogleAuthProvider();
  const auth = getAuth();
  useEffect(() => {
    // if()
    if (window.location.search == "") {
      getData();
    } else {
      let params = new URLSearchParams(window.location.search);
      let billId = params.get("id");
      if (billId == null) {
        setBill(null);
        setView("BillViaLink");
        return;
      } else {
        getBill(billId);
      }
    }
  }, []);

  async function getBill(billId) {
    setLoadFlag(true);
    let b = await getSingleBillFromBackend(billId);
    console.log(b);
    if (b == null) {
      setBill(b);
      setLoadFlag(false);
      setView("BillViaLink");
      return;
    }
    b.date = new Date(b.date.toDate());
    setBill(b);
    setView("BillViaLink");
    setLoadFlag(false);
  }
  async function getData() {
    setLoadFlag(true);
    let response = await axios("http://localhost:3000/fruits");
    let list = await response.data;
    // let list = await getProductsFromBackend();
    // Add qty field for each product
    list = list.map((e, index) => {
      e.qty = 0;
      return e;
    });

    ////Check Login Session //////
    let cItems = [];
    let usr;
    // usr = JSON.parse(window.localStorage.getItem("user"));
    // if (usr == null) {
    // usr = "";
    // }
    await onAuthStateChanged(auth, (user) => {
      usr = {};
      if (user) {
        usr.name = user.displayName;
        usr.emailid = user.email;
        if (usr.emailid == "rajeshjainacademy@gmail.com") {
          usr.role = "admin";
          setView("adminPage");
        } else {
          usr.role = "user";
          setView("productsPage");
        }
      } else {
        usr = null;
        setView("productsPage");
      }
    });
    setUser(usr);

    if (!usr || usr.role == "user") {
      // get cartitems from local storage
      cItems = window.localStorage.getItem("cartItems");
      if (cItems == null) {
        setCartItems([]);
        window.localStorage.setItem("cartItems", JSON.stringify([]));
      } else {
        cItems = JSON.parse(cItems);
        setCartItems(cItems);
        // update product-list
        for (let i = 0; i < cItems.length; i++) {
          for (let j = 0; j < list.length; j++) {
            if (cItems[i].id == list[j].id) {
              list[j].qty = cItems[i].qty;
              list[j].total = cItems[i].total;
              list[j].finalPrice = cItems[i].finalPrice;
              break;
            } //if
          } //inner for
        } //outer for
      }
    } //...user

    ////
    setProductList(list);
    setFilteredProductList(list);
    // setCartItems(cItems);
    setLoadFlag(false);
  }
  function handleChangeQtyButtonClick(product) {
    updateProductLists(product);
    updateCartItemsQty(product);
  }
  function handleAddToCartButtonClick(product) {
    updateProductLists(product);
    updateCartItems(product);
  }
  function updateProductLists(product) {
    let fProductList = filteredProductList.map((p, index) => {
      if (p.id != product.id) return p;
      return product;
    });
    let pList = productList.map((p, index) => {
      if (p.id != product.id) return p;
      return product;
    });
    setFilteredProductList(fProductList);
    setProductList(pList);
  }
  function updateCartInLocalStorage(cItems) {
    window.localStorage.setItem("cartItems", JSON.stringify(cItems));
  }
  function updateCartItems(product) {
    let cItems = [...cartItems];
    cItems.push(product);
    setCartItems(cItems);
    updateCartInLocalStorage(cItems);
    let total = 0;
    cItems.forEach((p, index) => {
      total = total + p.total;
    });
    setCartItemsTotalAmount(total);
  }
  function updateCartItemsQty(product) {
    let cItems;
    if (product.qty == 0) {
      cItems = cartItems.filter((p, index) => p.id != product.id);
    } else {
      cItems = cartItems.map((p, index) => {
        if (p.id != product.id) return p;
        return product;
      });
    }
    let total = 0;
    cItems.forEach((p, index) => {
      total = total + p.total;
    });
    setCartItems(cItems);
    updateCartInLocalStorage(cItems);
    setCartItemsTotalAmount(total);
  }
  function handleSearchKeyUp(searchText) {}
  function handleLoginButtonClick() {
    setView("loginPage");
  }
  function handleSignupButtonClick() {
    setView("signupPage");
  }
  function handleLogoClick() {
    if (user && user.role == "admin") {
      setView("adminPage");
    } else {
      setView("productsPage");
    }
  }
  function handleLoginSuccess(user) {
    setUser(user);
    if (user.role == "admin") {
      setView("adminPage");
    } else if (user.role == "user") {
      setView("productsPage");
    }
    window.localStorage.setItem("user", JSON.stringify(user));
  }
  function handleLogoutButtonClick() {
    auth.signOut();
    setView("productsPage");
    setUser("");
    // window.localStorage.removeItem("user");
    // setCartItems([]);
  }
  function handleEditProductButtonClick() {
    setAdminView("edit");
  }
  function handleProductListClick() {
    setAdminView("list");
  }
  function handleProductEditFormSubmit(product) {
    let fProductList = filteredProductList.map((p, index) => {
      if (p.id != product.id) return p;
      return product;
    });
    let pList = productList.map((p, index) => {
      if (p.id != product.id) return p;
      return product;
    });
    setFilteredProductList(fProductList);
    setProductList(pList);
    setAdminView("list");
  }
  function showMessage(message) {
    setMessage(message);
    window.setTimeout(setMessage("", 3000));
  }
  function handleDeleteProduct(product) {
    let fProductList = filteredProductList.filter(
      (p, index) => p.id != product.id
    );
    let pList = productList.filter((p, index) => p.id != product.id);
    setFilteredProductList(fProductList);
    onAddToCartButtonClick;
    setProductList(pList);
  }
  function handleAddProductClick() {
    setAdminView("add");
  }
  function handleProductAddFormSubmit(product) {
    let fProductList = [...filteredProductList];
    fProductList.push(product);
    let pList = [...productList];
    pList.push(product);
    setFilteredProductList(fProductList);
    setProductList(pList);
    setAdminView("list");
  }
  function handleCartClick() {
    if (!user && cartItems.length > 0) {
      // setView("cartClickWithoutLogin");
      // showMessage("You need to login first");
      setMessage("You need to login first");
      window.setTimeout(() => {
        setMessage("");
      }, 3000);
    } else {
      setView("cartPage");
    }
  }
  function handleLoginUsingGoogleButtonClick() {
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        // IdP data available using getAdditionalUserInfo(result)
        // ...
        console.log(user);
        let usr = {};
        usr.name = user.displayName;
        usr.emailid = user.email;
        if (usr.emailid == "rajeshjainacademy@gmail.com") {
          usr.role = "admin";
          setView("adminPage");
        } else {
          usr.role = "user";
          setView("productsPage");
        }
        setUser(usr);
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  }
  function handleCancelLoginClick() {
    setView("productsPage");
  }
  function handleStartShoppingClick() {
    setView("productsPage");
  }
  function handleBackToShoppingClick() {
    setView("productsPage");
  }
  function handleProceedToBuyClick() {
    setView("billPage");
  }
  function handleSearchTextChange(searchText) {
    let fList = productList.filter((e, index) =>
      e.name.toLowerCase().startsWith(searchText.toLowerCase())
    );
    setFilteredProductList(fList);
  }
  function handleStartShoppingAgain() {
    window.location = "/";
    // window.location.reload();
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
      <div className="">
        {view != "BillViaLink" && (
          <NavigationBar
            cartItems={cartItems}
            // cartItemsTotalAmount={cartItemsTotalAmount}
            onSearchKeyUp={handleSearchKeyUp}
            onLoginButtonClick={handleLoginButtonClick}
            onSignupButtonClick={handleSignupButtonClick}
            onLogoutButtonClick={handleLogoutButtonClick}
            onLoginUsingGoogleButtonClick={handleLoginUsingGoogleButtonClick}
            onSearchTextChange={handleSearchTextChange}
            // onGoogleLoginSuccess={handleGoogleLoginSuccess}
            onLogoClick={handleLogoClick}
            // onCartButtonClick={handleCartButtonClick}
            onCartClick={handleCartClick}
            view={view}
            user={user}
            adminView={adminView}
            message={message}
          />
        )}
      </div>
      {/* <div className="d-block d-md-none">
        <SideBar
          onLoginButtonClick={handleLoginButtonClick}
          onSignupButtonClick={handleSignupButtonClick}
        />
      </div> */}
      <div className="container-fluid  content-page">
        {!loadFlag && view == "productsPage" && (
          <ProductsPage
            filteredProductList={filteredProductList}
            onAddToCartButtonClick={handleAddToCartButtonClick}
            onChangeQtyButtonClick={handleChangeQtyButtonClick}
            user={user}
          />
        )}
        {!loadFlag && view == "cartPage" && (!user || user.role == "user") && (
          <CartPage
            cartItems={cartItems}
            onChangeQtyButtonClick={handleChangeQtyButtonClick}
            onStartShoppingClick={handleStartShoppingClick}
            onBackToShoppingClick={handleBackToShoppingClick}
            onProceedToBuyClick={handleProceedToBuyClick}
            user={user}
          />
        )}
        {!loadFlag && view == "billPage" && (!user || user.role == "user") && (
          <BillPage
            cartItems={cartItems}
            cartItemsTotalAmount={cartItemsTotalAmount}
            onChangeQtyButtonClick={handleChangeQtyButtonClick}
            onStartShoppingClick={handleStartShoppingClick}
            onBackToShoppingClick={handleBackToShoppingClick}
            onProceedToBuyClick={handleProceedToBuyClick}
            user={user}
          />
        )}
        {!loadFlag && view == "adminPage" && (
          <AdminProducts
            filteredProductList={filteredProductList}
            onEditProductButtonClick={handleEditProductButtonClick}
            onChangeQtyButtonClick={handleChangeQtyButtonClick}
            onProductListClick={handleProductListClick}
            onProductEditFormSubmit={handleProductEditFormSubmit}
            onProductAddFormSubmit={handleProductAddFormSubmit}
            onDeleteProduct={handleDeleteProduct}
            onAddProductClick={handleAddProductClick}
            user={user}
            adminView={adminView}
            showMessage={showMessage}
          />
        )}

        {(view == "loginPage" || view == "cartClickWithoutLogin") && (
          <LoginPage
            onLoginSuccess={handleLoginSuccess}
            onCancelLoginClick={handleCancelLoginClick}
            user={user}
            view={view}
          />
        )}
        {view == "signupPage" && (
          <SignupPage onSignupButtonClick={handleSignupButtonClick} />
        )}
      </div>
      {view == "BillViaLink" && (
        <ABill bill={bill} onStartShoppingAgain={handleStartShoppingAgain} />
      )}
    </>
  );
}
export default EComm;
