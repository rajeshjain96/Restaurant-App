import { useEffect, useState } from "react";
import fieldValidate from "./FormValidations.js";
import "../formstyles.css";
import FileUpload from "./SingleFileUpload.jsx";
export default function AdminCustomerForm(props) {
  let [customer, setCustomer] = useState("");
  let [errorCustomer, setErrorCustomer] = useState(props.customerValidations);
  let [flagFormInvalid, setFlagFormInvalid] = useState(false);
  let { action } = props;
  let { selectedEntity } = props;
  let { categoryList } = props;
  // let { fileList } = props;
  let [fileList, setFileList] = useState(getFileListFromCustomerSchema());
  function getFileListFromCustomerSchema() {
    let list = [];
    props.customerSchema.forEach((e, index) => {
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
      // emptyCustomer.category = props.categoryToRetain;
      // emptyCustomer.categoryId = props.categoryIdToRetain;
      setCustomer(props.emptyCustomer);
    } else if (action === "update") {
      // in edit mode, keep the update button enabled at the beginning
      setFlagFormInvalid(false);
      setCustomer(props.customerToBeEdited);
    }
  }
  function handleTextFieldChange(event) {
    let name = event.target.name;
    setCustomer({ ...customer, [name]: event.target.value });
    let message = fieldValidate(event, errorCustomer);
    let errCustomer = { ...errorCustomer };
    errorCustomer[`${name}`].message = message;
    setErrorCustomer(errCustomer);
  }
  function handleBlur(event) {
    let name = event.target.name;
    let message = fieldValidate(event, errorCustomer);
    let errCustomer = { ...errorCustomer };
    errorCustomer[`${name}`].message = message;
    setErrorCustomer(errCustomer);
  }
  function handleFocus(event) {
    setFlagFormInvalid(false);
  }
  function checkAllErrors() {
    for (let field in errorCustomer) {
      if (errorCustomer[field].message !== "") {
        return true;
      } //if
    } //for
    let errCustomer = { ...errorCustomer };
    let flag = false;
    for (let field in customer) {
      if (customer[field] == "") {
        flag = true;
        errCustomer[field].message = "Required...";
      } //if
    } //for
    if (flag) {
      setErrorCustomer(errCustomer);
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
          customer[fileList[i].fileAttributeName] = fileList[i].newFileName;
          //currently this is only for one file.
          customer.file = fileList[i].newFile;
        }
      } //for
      // console.log(fileList);
    }
    props.onFormSubmit(customer);
  };
  function handleFileChange(file, fileIndex) {
    if (action == "add") {
      setCustomer({
        ...customer,
        file: file,
        [fileList[fileIndex].fileAttributeName]: file.name,
      });
    } else if (action == "update") {
      // setCustomer({ ...customer, newFile: file, newImage: file.name });
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
    setCustomer({ ...customer, category: category, categoryId: categoryId });
  }

  function handleCancelFormButton() {
    props.onCancelFormButton();
  }
  return (
    <>
      <form className="text-thick px-4" onSubmit={handleFormSubmit}>
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
                value={customer.name}
                onChange={handleTextFieldChange}
                onBlur={handleBlur}
                onFocus={handleFocus}
                placeholder="Enter Customer Name"
              />
            </div>
            <div className="">
              {errorCustomer.name.message ? (
                <span className="text-danger">
                  {errorCustomer.name.message}
                </span>
              ) : null}
            </div>
          </div>
          <div className="col-6 my-2">
            <div className="text-bold my-1">
              <label>Email-Id</label>
            </div>
            <div className="px-0">
              <input
                type="text"
                className="form-control"
                name="emailId"
                value={customer.emailId}
                onChange={handleTextFieldChange}
                onBlur={handleBlur}
                onFocus={handleFocus}
                placeholder="Enter Email-Id"
              />
            </div>
            <div className="">
              {errorCustomer.emailId.message ? (
                <span className="text-danger">
                  {errorCustomer.emailId.message}
                </span>
              ) : null}
            </div>
          </div>
          {/* field starts */}
          <div className="col-6 my-2">
            <div className="text-bold my-1">
              <label>Mobile Number</label>
            </div>
            <div className="px-0">
              <input
                type="text"
                className="form-control"
                name="mobileNumber"
                value={customer.mobileNumber}
                onChange={handleTextFieldChange}
                onBlur={handleBlur}
                onFocus={handleFocus}
                placeholder="Enter Mobile Number"
              />
            </div>
            <div className="">
              {errorCustomer.mobileNumber.message ? (
                <span className="text-danger">
                  {errorCustomer.mobileNumber.message}
                </span>
              ) : null}
            </div>
          </div>
          {/* field ends */}
          {/* field starts */}
          <div className="col-6 my-2">
            <div className="text-bold my-1">
              <label>Company Name</label>
            </div>
            <div className="px-0">
              <input
                type="text"
                className="form-control"
                name="companyName"
                value={customer.companyName}
                onChange={handleTextFieldChange}
                onBlur={handleBlur}
                onFocus={handleFocus}
                placeholder="Enter Company Name"
              />
            </div>
            <div className="">
              {errorCustomer.companyName.message ? (
                <span className="text-danger">
                  {errorCustomer.companyName.message}
                </span>
              ) : null}
            </div>
          </div>
          {/* field ends */}
          {/* field starts */}
          <div className="col-6 my-2">
            <div className="text-bold my-1">
              <label>Designation</label>
            </div>
            <div className="px-0">
              <input
                type="text"
                className="form-control"
                name="designation"
                value={customer.designation}
                onChange={handleTextFieldChange}
                onBlur={handleBlur}
                onFocus={handleFocus}
                placeholder="Enter Designation"
              />
            </div>
            <div className="">
              {errorCustomer.designation.message ? (
                <span className="text-danger">
                  {errorCustomer.designation.message}
                </span>
              ) : null}
            </div>
          </div>
          {/* field ends */}
          {/* field starts */}
          <div className="col-6 my-2">
            <div className="text-bold my-1">
              <label>Address</label>
            </div>
            <div className="px-0">
              <textarea
                className="form-control"
                name="address"
                value={customer.address}
                onChange={handleTextFieldChange}
                onBlur={handleBlur}
                onFocus={handleFocus}
                placeholder="Enter Address of the company/person."
              />
            </div>
            <div className="">
              {errorCustomer.address.message ? (
                <span className="text-danger">
                  {errorCustomer.address.message}
                </span>
              ) : null}
            </div>
          </div>
          {/* field ends */}

          <div className="col-12">
            <button
              className="btn btn-primary"
              type="submit"
              // disabled={flagFormInvalid}
            >
              {(action + " " + selectedEntity.singularName).toUpperCase()}
            </button>{" "}
            <button
              className="btn btn-primary"
              type="button"
              onClick={handleCancelFormButton}
            >
              Cancel
            </button>{" "}
            &nbsp;{" "}
            <span className="text-danger">
              {" "}
              {flagFormInvalid ? "Missing data.." : ""}
            </span>
          </div>
        </div>
      </form>
    </>
  );
}
