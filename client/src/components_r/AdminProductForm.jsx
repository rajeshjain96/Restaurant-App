import { useEffect, useState } from "react";
import fieldValidate from "./FormValidations.js";
import "../formstyles.css";
export default function AdminProductForm(props) {
  let [product, setProduct] = useState("");
  let [errorProduct, setErrorProduct] = useState(props.productValidations);
  // let [product, setProduct] = useState({
  //   name: "",
  //   // category: "",
  //   // categoryId: -1,
  //   // info: "",
  //   price: "",
  //   // imageName: null,
  //   // instock: 1,
  //   // rating: 5,
  // });
  // let [errorProduct, setErrorProduct] = useState({
  //   name: { message: "", mxLen: 80, mnLen: 4, onlyDigits: false },
  //   nameMarathi: { message: "", mxLen: 40, mnLen: 1, onlyDigits: false },
  //   information: { message: "", onlyDigits: false },
  //   price: {
  //     message: "",
  //     mxLen: 30,
  //     mnLen: 2,
  //     onlyDigits: false,
  //     // dependent: "finalPrice",
  //   },
  //   category: { message: "" },
  //   categoryId: { message: "" },
  // });
  let [loadFlag, setLoadFlag] = useState(false);
  let [flagFormInvalid, setFlagFormInvalid] = useState(false);

  let { action } = props;
  let { itemToBeEdited } = props;
  let { selectedEntity } = props;
  let { emptyValidationsArray } = props;

  let emptyProduct;

  useEffect(() => {
    window.scroll(0, 0);
    init();
  }, []);
  function init() {
    emptyProduct = product;
    let { action } = props;
    if (action === "add") {
      setFlagFormInvalid(true);
      // emptyProduct.category = props.categoryToRetain;
      // emptyProduct.categoryId = props.categoryIdToRetain;
      setProduct(props.productSchema);
    } else if (action === "update") {
      // in edit mode, keep the update button enabled at the beginning
      setFlagFormInvalid(false);
      setProduct(props.productToBeEdited);
    }
  }
  function handleTextFieldChange(event) {
    let name = event.target.name;
    setProduct({ ...product, [name]: event.target.value });
    let message = fieldValidate(event, errorProduct);
    let errProduct = { ...errorProduct };
    errorProduct[`${name}`].message = message;
    setErrorProduct(errProduct);
  }
  function handleChange(event) {
    let name = event.target.name;
    setProduct({ ...product, [name]: event.target.value });
    // isValid(event);
    let message = fieldValidate(event, errorProduct);
    let errProduct = { ...errorProduct };
    errorProduct[`${name}`].message = message;
    setErrorProduct(errProduct);
  }
  function handleBlur(event) {
    let name = event.target.name;
    let message = fieldValidate(event, errorProduct);
    let errProduct = { ...errorProduct };
    errorProduct[`${name}`].message = message;
    setErrorProduct(errProduct);
  }
  function handleFocus(event) {
    checkAllErrors();
  }
  function checkAllErrors() {
    for (let field in errorProduct) {
      if (errorProduct[field].message !== "") {
        setFlagFormInvalid(true);
        return;
      } //if
    } //for
    setFlagFormInvalid(false);
  }
  const handleFormSubmit = (e) => {
    e.preventDefault();
    // for dropdown, data is to be modified
    props.onFormSubmit(product);
  };
  function handleFormCloseClick() {
    props.onFormCloseClick();
  }
  function handleChangeImageClick(index) {
    props.onChangeImageClick(index);
  }
  function handleChangeImageCancelClick(index) {
    props.onChangeImageCancelClick(index);
  }
  if (loadFlag) {
    return <div>Wait...</div>;
  }
  return (
    <div className="p-2">
      <form className="text-thick p-4" onSubmit={handleFormSubmit}>
        {/* row starts */}
        <div className="form-group row align-items-center">
          <div className="col-6 my-2">
            <div className="text-bold my-1">
              <label>Name</label>
            </div>
            <div className=" px-0">
              <input
                type="text"
                className="form-control"
                name="name"
                value={product.name}
                onChange={handleTextFieldChange}
                onBlur={handleBlur}
                onFocus={handleFocus}
                placeholder="Enter product name"
              />
            </div>
            <div className="">
              {errorProduct.name.message ? (
                <span className="text-danger">{errorProduct.name.message}</span>
              ) : null}
            </div>
          </div>
          <div className="col-6 my-2">
            <div className="text-bold my-1">
              <label>Price</label>
            </div>
            <div className="px-0">
              <input
                type="text"
                className="form-control"
                name="price"
                value={product.price}
                onChange={handleTextFieldChange}
                onBlur={handleBlur}
                onFocus={handleFocus}
                placeholder="Enter price in Rs."
              />
            </div>
            <div className="">
              {errorProduct.price.message ? (
                <span className="text-danger">
                  {errorProduct.price.message}
                </span>
              ) : null}
            </div>
          </div>
          <div className="col-6 my-2">
            <div className="text-bold my-1">
              <label>Information</label>
            </div>
            <div className="px-0">
              <input
                type="text"
                className="form-control"
                name="info"
                value={product.info}
                onChange={handleTextFieldChange}
                onBlur={handleBlur}
                onFocus={handleFocus}
                placeholder="Enter information"
              />
            </div>
            <div className="">
              {errorProduct.info.message ? (
                <span className="text-danger">
                  {errorProduct.info.message}
                </span>
              ) : null}
            </div>
          </div>
          <div className="col-6 my-2">
            <div className="text-bold my-1">
              <label>Image Name</label>
            </div>
            <div className="px-0">
              <input
                type="text"
                className="form-control"
                name="imageName"
                value={product.imageName}
                onChange={handleTextFieldChange}
                onBlur={handleBlur}
                onFocus={handleFocus}
                placeholder="Enter image name"
              />
            </div>
            <div className="">
              {errorProduct.imageName.message ? (
                <span className="text-danger">
                  {errorProduct.imageName.message}
                </span>
              ) : null}
            </div>
          </div>
          <div className="col-12">
            <button
              className="btn btn-primary"
              type="submit"
              disabled={flagFormInvalid}
            >
              {(action + " " + selectedEntity.singularName).toUpperCase()}
            </button>
          </div>
        </div>
        <input type="hidden" name="productId" value={product.productId} />
      </form>
    </div>
  );
}
