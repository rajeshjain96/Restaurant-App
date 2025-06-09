import { useEffect, useState } from "react";
import fieldValidate from "./FormValidations.js";
import "../formstyles.css";
// import FileUpload from "./SingleFileUpload.jsx";
import SingleFileUpload from "./SingleFileUpload.jsx";
export default function AdminProductForm(props) {
  let [product, setProduct] = useState("");
  let [errorProduct, setErrorProduct] = useState(props.productValidations);
  let [flagFormInvalid, setFlagFormInvalid] = useState(false);
  let { action } = props;
  let { selectedEntity } = props;
  let { categoryList } = props;
  // let { singleFileList } = props;
  let [singleFileList, setSingleFileList] = useState(
    getSingleFileListFromProductSchema()
  );
  function getSingleFileListFromProductSchema() {
    let list = [];
    props.productSchema.forEach((e, index) => {
      let obj = {};
      if (e.type == "singleFile") {
        obj["fileAttributeName"] = e.attribute;
        obj["allowedFileType"] = e.allowedFileType;
        obj["allowedSize"] = e.allowedSize;
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
      if (errorProduct[field] && product[field] == "") {
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
      let pr = { ...product };
      for (let i = 0; i < singleFileList.length; i++) {
        let fAName = singleFileList[i].fileAttributeName;
        if (pr[fAName + "New"]) {
          // image is modified
          // if field-name is image, temporarily in "imageNew" field, new file-name is saved.
          pr[fAName] = pr[fAName + "New"];
          delete pr[fAName + "New"];
        }
      } //for
      console.log(pr);

      setProduct(pr);
      props.onFormSubmit(pr);
    }
  };
  // props.onFileChange(selectedFile,fileIndex,message);
  function handleFileChange(selectedFile, fileIndex, message) {
    if (action == "add") {
      setProduct({
        ...product,
        // file: file,
        ["file" + fileIndex]: selectedFile,
        [singleFileList[fileIndex].fileAttributeName]: selectedFile.name,
        // [singleFileList[fileIndex].fileAttributeName]: file.name,
      });
      let errProduct = { ...errorProduct };
      console.log(singleFileList[fileIndex].fileAttributeName);

      errProduct[singleFileList[fileIndex].fileAttributeName].message = message;
      setErrorProduct(errProduct);
      // setErrorProduct({ ...errorProduct, message: message });
    }
  }
  function handleFileChangeUpdateMode(selectedFile, fileIndex, message) {
    let newFileName = "";
    if (selectedFile) {
      newFileName = selectedFile.name;
    } else {
      // user selected a new file but then deselected
      newFileName = "";
    }
    setProduct({
      ...product,
      // file: file,
      ["file" + fileIndex]: selectedFile,
      [singleFileList[fileIndex].fileAttributeName + "New"]: newFileName,
      // [singleFileList[fileIndex].fileAttributeName]: selectedFile.name,
    });
    let errProduct = { ...errorProduct };
    errProduct[singleFileList[fileIndex].fileAttributeName].message = message;
    setErrorProduct(errProduct);
  }

  // This one is old logic
  // function handleFileChange(file, fileIndex) {
  //   if (action == "add") {
  //     setProduct({
  //       ...product,
  //       file: file,
  //       [singleFileList[fileIndex].fileAttributeName]: file.name,
  //     });
  //   } else if (action == "update") {
  //     // setProduct({ ...product, newFile: file, newImage: file.name });
  //     // props.onFileChangeInUpdateMode(file, fileIndex);
  //     let fl = [...singleFileList];
  //     fl[fileIndex]["newFileName"] = file.name;
  //     fl[fileIndex]["newFile"] = file;
  //     setSingleFileList(fl);
  //   }
  // }
  function handleCancelChangeImageClick() {
    if (action == "update") {
      let fl = [...singleFileList];
      fl[fileIndex]["newFileName"] = "";
      fl[fileIndex]["newFile"] = "";
      setSingleFileList(fl);
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
            <SingleFileUpload
              singleFileList={singleFileList}
              action={action}
              name="image"
              fileName={product.image}
              onFileChange={handleFileChange}
              onFileChangeUpdateMode={handleFileChangeUpdateMode}
              onCancelChangeImageClick={handleCancelChangeImageClick}
            />
            <div className="">
              {errorProduct.image.message ? (
                <span className="text-danger">
                  {errorProduct.image.message}
                </span>
              ) : null}
            </div>
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
