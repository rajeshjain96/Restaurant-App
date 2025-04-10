import { useEffect, useState } from "react";
import fieldValidate from "./FormValidations.js";
import "../formstyles.css";
import FileUpload from "./FileUpload.jsx";
export default function AdminProductForm(props) {
  let [product, setProduct] = useState("");
  let [errorProduct, setErrorProduct] = useState(props.productValidations);
  let [flagFormInvalid, setFlagFormInvalid] = useState(false);
  let { action } = props;
  let { selectedEntity } = props;
  let { categoryList } = props;
  // let { fileList } = props;
  let [fileList, setFileList] = useState(getFileListFromProductSchema());
  function getFileListFromProductSchema() {
    let list = [];
    props.productSchema.forEach((e, index) => {
      let obj = {};
      if (e.type == "file") {
        obj["fileAttributeName"] = e.attribute;
        list.push(obj);
      }
    });
    return list;
  }
  useEffect(() => {
    window.scroll(0, 0);
    init();
  }, []);
  function init() {
    let { action } = props;
    if (action === "add") {
      // emptyProduct.category = props.categoryToRetain;
      // emptyProduct.categoryId = props.categoryIdToRetain;
      setProduct(props.emptyProduct);
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
  function handleBlur(event) {
    let name = event.target.name;
    let message = fieldValidate(event, errorProduct);
    let errProduct = { ...errorProduct };
    errorProduct[`${name}`].message = message;
    setErrorProduct(errProduct);
  }
  function handleFocus(event) {
    setFlagFormInvalid(false);
  }
  function checkAllErrors() {
    for (let field in errorProduct) {
      if (errorProduct[field].message !== "") {
        return true;
      } //if
    } //for
    let errProduct = { ...errorProduct };
    let flag = false;
    for (let field in product) {
      if (product[field] == "") {
        flag = true;
        errProduct[field].message = "Required...";
      } //if
    } //for
    if (flag) {
      setErrorProduct(errProduct);
      return true;
    }
    return false;
  }
  const handleFormSubmit = (e) => {
    e.preventDefault();
    // for dropdown, data is to be modified
    // first check whether all entries are valid or not
    if (checkAllErrors()) {
      setFlagFormInvalid(true);
      return;
    }
    setFlagFormInvalid(false);
    if (action == "update") {
      // There might be files in this form, add those also
      for (let i = 0; i < fileList.length; i++) {
        if (fileList[i].newFileName) {
          product[fileList[i].fileAttributeName] = fileList[i].newFileName;
          //currently this is only for one file.
          product.file = fileList[i].newFile;
        }
      } //for
      // console.log(fileList);
    }
    props.onFormSubmit(product);
  };
  function handleFileChange(file, fileIndex) {
    if (action == "add") {
      setProduct({
        ...product,
        file: file,
        [fileList[fileIndex].fileAttributeName]: file.name,
      });
    } else if (action == "update") {
      // setProduct({ ...product, newFile: file, newImage: file.name });
      // props.onFileChangeInUpdateMode(file, fileIndex);
      let fl = [...fileList];
      fl[fileIndex]["newFileName"] = file.name;
      fl[fileIndex]["newFile"] = file;
      setFileList(fl);
    }
  }
  function handleCancelChangeImageClick() {
    if (action == "update") {
      let fl = [...fileList];
      fl[fileIndex]["newFileName"] = "";
      fl[fileIndex]["newFile"] = "";
      setFileList(fl);
    }
  }
  function handleSelectCategoryChange(event) {
    let index = event.target.selectedIndex; // get selected index, instead of selected value
    var optionElement = event.target.childNodes[index];
    var selectedCategoryId = optionElement.getAttribute("id");
    let category = event.target.value.trim();
    let categoryId = selectedCategoryId;
    setProduct({ ...product, category: category, categoryId: categoryId });
  }

  let optionsCategory = categoryList.map((category, index) =>
    category.rating != 1 ? (
      <option value={category.name} key={index} id={category._id}>
        {category.name}
      </option>
    ) : null
  );
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
                <span className="text-danger">{errorProduct.info.message}</span>
              ) : null}
            </div>
          </div>
          <div className="col-12 my-2">
            <div className="text-bold my-1">
              <label>Image</label>
            </div>
            <FileUpload
              fileList={fileList}
              action={action}
              name="image"
              value={product.image}
              onFileChange={handleFileChange}
              onCancelChangeImageClick={handleCancelChangeImageClick}
            />
          </div>
          <div className="col-6 my-2">
            <div className="text-bold my-1">
              <label>Category</label>
            </div>
            <div className="px-0">
              <select
                className="form-control"
                name="category"
                value={product.category}
                onChange={handleSelectCategoryChange}
                onBlur={handleBlur}
                onFocus={handleFocus}
              >
                <option> Select Category </option>
                {optionsCategory}
              </select>
            </div>
          </div>
          <div className="col-12">
            <button
              className="btn btn-primary"
              type="submit"
              // disabled={flagFormInvalid}
            >
              {(action + " " + selectedEntity.singularName).toUpperCase()}
            </button>{" "}
            &nbsp;{" "}
            <span className="text-danger">
              {" "}
              {flagFormInvalid ? "Missing data.." : ""}
            </span>
          </div>
        </div>
      </form>
    </div>
  );
}
