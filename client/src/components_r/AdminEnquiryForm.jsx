import { useEffect, useState } from "react";
import fieldValidate from "./FormValidations.js";
import "../formstyles.css";
// import FileUpload from "./SingleFileUpload.jsx";
import SingleFileUpload from "./SingleFileUpload.jsx";
export default function AdminEnquiryForm(props) {
  let [enquiry, setEnquiry] = useState("");
  let [errorEnquiry, setErrorEnquiry] = useState(props.enquiryValidations);
  let [flagFormInvalid, setFlagFormInvalid] = useState(false);
  let { action } = props;
  let { selectedEntity } = props;
  let { productList } = props;
  let { enquirySchema } = props;
  let [singleFileList, setSingleFileList] = useState(
    getSingleFileListFromEnquirySchema()
  );
  function getSingleFileListFromEnquirySchema() {
    let list = [];
    enquirySchema.forEach((e, index) => {
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
      setEnquiry(props.emptyEnquiry);
    } else if (action === "update") {
      // in edit mode, keep the update button enabled at the beginning
      setFlagFormInvalid(false);
      setEnquiry(props.enquiryToBeEdited);
    }
  }
  function handleTextFieldChange(event) {
    let name = event.target.name;
    setEnquiry({ ...enquiry, [name]: event.target.value });
    let message = fieldValidate(event, errorEnquiry);
    let errEnquiry = { ...errorEnquiry };
    errorEnquiry[`${name}`].message = message;
    setErrorEnquiry(errEnquiry);
  }
  function handleBlur(event) {
    let name = event.target.name;
    let message = fieldValidate(event, errorEnquiry);
    let errEnquiry = { ...errorEnquiry };
    errorEnquiry[`${name}`].message = message;
    setErrorEnquiry(errEnquiry);
  }
  function handleFocus(event) {
    setFlagFormInvalid(false);
  }
  function checkAllErrors() {
    for (let field in errorEnquiry) {
      if (errorEnquiry[field].message !== "") {
        return true;
      } //if
    } //for
    let errEnquiry = { ...errorEnquiry };
    let flag = false;
    for (let field in enquiry) {
      if (errorEnquiry[field] && enquiry[field] == "") {
        flag = true;
        errEnquiry[field].message = "Required...";
      } //if
    } //for
    if (flag) {
      setErrorEnquiry(errEnquiry);
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
      let pr = { ...enquiry };
      for (let i = 0; i < singleFileList.length; i++) {
        let fAName = singleFileList[i].fileAttributeName;
        if (pr[fAName + "New"]) {
          // image is modified
          // if field-name is image, temporarily in "imageNew" field, new file-name is saved.
          pr[fAName] = pr[fAName + "New"];
          delete pr[fAName + "New"];
        }
      } //for
      setEnquiry(pr);
      props.onFormSubmit(pr);
    } else if (action == "add") {
      props.onFormSubmit(enquiry);
    }
  };
  function handleFileChange(selectedFile, fileIndex, message) {
    setFlagFormInvalid(false);
    if (action == "add") {
      setEnquiry({
        ...enquiry,
        ["file" + fileIndex]: selectedFile,
        [singleFileList[fileIndex].fileAttributeName]: selectedFile.name,
      });
      let errEnquiry = { ...errorEnquiry };
      errEnquiry[singleFileList[fileIndex].fileAttributeName].message = message;
      setErrorEnquiry(errEnquiry);
      // setErrorEnquiry({ ...errorEnquiry, message: message });
    }
  }
  function handleFileRemove(selectedFile, fileIndex, message) {
    if (action == "add") {
      setFlagFormInvalid(false);
      setQuotation({
        ...quotation,
        [singleFileList[fileIndex].fileAttributeName]: "",
      });
      let errQuotation = { ...errorQuotation };
      errQuotation[singleFileList[fileIndex].fileAttributeName].message =
        message;
      setErrorQuotation(errQuotation);
    } else if (action == "update") {
      let newFileName = "";
      if (selectedFile) {
        newFileName = selectedFile.name;
      } else {
        // user selected a new file but then deselected
        newFileName = "";
      }
      setQuotation({
        ...quotation,
        ["file" + fileIndex]: selectedFile,
        [singleFileList[fileIndex].fileAttributeName + "New"]: newFileName,
      });
      let errQuotation = { ...errorQuotation };
      errQuotation[singleFileList[fileIndex].fileAttributeName].message =
        message;
      setErrorQuotation(errQuotation);
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
    setEnquiry({
      ...enquiry,
      // file: file,
      ["file" + fileIndex]: selectedFile,
      [singleFileList[fileIndex].fileAttributeName + "New"]: newFileName,
      // [singleFileList[fileIndex].fileAttributeName]: selectedFile.name,
    });
    let errEnquiry = { ...errorEnquiry };
    errEnquiry[singleFileList[fileIndex].fileAttributeName].message = message;
    setErrorEnquiry(errEnquiry);
  }

  // This one is old logic
  // function handleFileChange(file, fileIndex) {
  //   if (action == "add") {
  //     setEnquiry({
  //       ...enquiry,
  //       file: file,
  //       [singleFileList[fileIndex].fileAttributeName]: file.name,
  //     });
  //   } else if (action == "update") {
  //     // setEnquiry({ ...enquiry, newFile: file, newImage: file.name });
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
  function handleSelectProductChange(event) {
    let index = event.target.selectedIndex; // get selected index, instead of selected value
    var optionElement = event.target.childNodes[index];
    var selectedProductId = optionElement.getAttribute("id");
    let product = event.target.value.trim();
    let productId = selectedProductId;
    setEnquiry({ ...enquiry, product: product, productId: productId });
  }

  let optionsProducts = productList.map((product, index) => (
    <option value={product.name} key={index} id={product._id}>
      {product.name}
    </option>
  ));

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
                value={enquiry.name}
                onChange={handleTextFieldChange}
                onBlur={handleBlur}
                onFocus={handleFocus}
                placeholder="Enter customer name"
              />
            </div>
            <div className="">
              {errorEnquiry.name.message ? (
                <span className="text-danger">{errorEnquiry.name.message}</span>
              ) : null}
            </div>
          </div>
          <div className="col-6 my-2">
            <div className="text-bold my-1">
              <label>Product Interested In </label>
            </div>
            <div className="px-0">
              <select
                className="form-control"
                name="product"
                value={enquiry.product}
                onChange={handleSelectProductChange}
                onBlur={handleBlur}
                onFocus={handleFocus}
              >
                <option> Select Product </option>
                {optionsProducts}
              </select>
            </div>
          </div>
          <div className="col-6 my-2">
            <div className="text-bold my-1">
              <label>Site Location</label>
            </div>
            <div className="px-0">
              <input
                type="text"
                className="form-control"
                name="siteLocation"
                value={enquiry.siteLocation}
                onChange={handleTextFieldChange}
                onBlur={handleBlur}
                onFocus={handleFocus}
                placeholder="Enter site location"
              />
            </div>
            <div className="">
              {errorEnquiry.siteLocation.message ? (
                <span className="text-danger">
                  {errorEnquiry.siteLocation.message}
                </span>
              ) : null}
            </div>
          </div>
          <div className="col-6 my-2">
            <div className="text-bold my-1">
              <label>Mobile Number </label>
            </div>
            <div className="px-0">
              <input
                type="text"
                className="form-control"
                name="mobileNumber"
                value={enquiry.mobileNumber}
                onChange={handleTextFieldChange}
                onBlur={handleBlur}
                onFocus={handleFocus}
                placeholder="Enter mobile Number"
              />
            </div>
            <div className="">
              {errorEnquiry.mobileNumber.message ? (
                <span className="text-danger">
                  {errorEnquiry.mobileNumber.message}
                </span>
              ) : null}
            </div>
          </div>
          <div className="col-6 my-2">
            <div className="text-bold my-1">
              <label>City </label>
            </div>
            <div className="px-0">
              <input
                type="text"
                className="form-control"
                name="city"
                value={enquiry.city}
                onChange={handleTextFieldChange}
                onBlur={handleBlur}
                onFocus={handleFocus}
                placeholder="Enter city-name"
              />
            </div>
            <div className="">
              {errorEnquiry.city.message ? (
                <span className="text-danger">{errorEnquiry.city.message}</span>
              ) : null}
            </div>
          </div>
          <div className="col-6 my-2">
            <div className="text-bold my-1">
              <label>Region</label>
            </div>
            <div className="px-0">
              <input
                type="text"
                className="form-control"
                name="region"
                value={enquiry.region}
                onChange={handleTextFieldChange}
                onBlur={handleBlur}
                onFocus={handleFocus}
                placeholder="Enter Region"
              />
            </div>
            <div className="">
              {errorEnquiry.region.message ? (
                <span className="text-danger">
                  {errorEnquiry.region.message}
                </span>
              ) : null}
            </div>
          </div>
          <div className="col-12 my-2">
            <div className="text-bold my-1">
              <label>Remarks</label>
            </div>
            <div className="px-0">
              <textarea
                className="form-control"
                name="remarks"
                style={{ height: "300px" }}
                rows={5}
                value={enquiry.remarks}
                onChange={handleTextFieldChange}
                onBlur={handleBlur}
                onFocus={handleFocus}
                placeholder="Enter Remarks"
              ></textarea>
            </div>
            <div className="">
              {errorEnquiry.remarks.message ? (
                <span className="text-danger">
                  {errorEnquiry.remarks.message}
                </span>
              ) : null}
            </div>
          </div>

          <div className="col-12">
            <button className="btn btn-primary" type="submit">
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
