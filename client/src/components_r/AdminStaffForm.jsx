import { useEffect, useState } from "react";
import fieldValidate from "./FormValidations.js";
import "../formstyles.css";
export default function AdminStaffForm(props) {
  let [staff, setStaff] = useState("");
  let [errorStaff, setErrorStaff] = useState(props.staffValidations);
  let [flagFormInvalid, setFlagFormInvalid] = useState(false);
  let { action } = props;
  let { selectedEntity } = props;
  let { categoryList } = props;

  useEffect(() => {
    window.scroll(0, 0);
    init();
  }, []);
  function init() {
    let { action } = props;
    if (action === "add") {
      // emptyStaff.category = props.categoryToRetain;
      // emptyStaff.categoryId = props.categoryIdToRetain;
      setStaff(props.emptyStaff);
    } else if (action === "update") {
      // in edit mode, keep the update button enabled at the beginning
      setFlagFormInvalid(false);
      setStaff(props.staffToBeEdited);
    }
  }
  function handleTextFieldChange(event) {
    let name = event.target.name;
    setStaff({ ...staff, [name]: event.target.value });
    let message = fieldValidate(event, errorStaff);
    let errStaff = { ...errorStaff };
    errorStaff[`${name}`].message = message;
    setErrorStaff(errStaff);
  }
  function handleBlur(event) {
    let name = event.target.name;
    let message = fieldValidate(event, errorStaff);
    let errStaff = { ...errorStaff };
    errorStaff[`${name}`].message = message;
    setErrorStaff(errStaff);
  }
  function handleFocus(event) {
    setFlagFormInvalid(false);
  }
  function checkAllErrors() {
    for (let field in errorStaff) {
      if (errorStaff[field].message !== "") {
        return true;
      } //if
    } //for
    let errStaff = { ...errorStaff };
    let flag = false;
    for (let field in staff) {
      if (staff[field] == "") {
        flag = true;
        errStaff[field].message = "Required...";
      } //if
    } //for
    if (flag) {
      setErrorStaff(errStaff);
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

    props.onFormSubmit(staff);
  };
  function handleSelectCategoryChange(event) {
    let index = event.target.selectedIndex; // get selected index, instead of selected value
    var optionElement = event.target.childNodes[index];
    var selectedCategoryId = optionElement.getAttribute("id");
    let category = event.target.value.trim();
    let categoryId = selectedCategoryId;
    setStaff({ ...staff, category: category, categoryId: categoryId });
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
                value={staff.name}
                onChange={handleTextFieldChange}
                onBlur={handleBlur}
                onFocus={handleFocus}
                placeholder="Enter staff name"
              />
            </div>
            <div className="">
              {errorStaff.name.message ? (
                <span className="text-danger">{errorStaff.name.message}</span>
              ) : null}
            </div>
          </div>
          <div className="col-6 my-2">
            <div className="text-bold my-1">
              <label>Mobile Number</label>
            </div>
            <div className="px-0">
              <input
                type="text"
                className="form-control"
                name="mobileNumber"
                value={staff.mobileNumber}
                onChange={handleTextFieldChange}
                onBlur={handleBlur}
                onFocus={handleFocus}
                placeholder="Enter Mobile Number"
              />
            </div>
            <div className="">
              {errorStaff.mobileNumber.message ? (
                <span className="text-danger">
                  {errorStaff.mobileNumber.message}
                </span>
              ) : null}
            </div>
          </div>
          <div className="col-6 my-2">
            <div className="text-bold my-1">
              <label>Address</label>
            </div>
            <div className="px-0">
              <input
                type="text"
                className="form-control"
                name="address"
                value={staff.address}
                onChange={handleTextFieldChange}
                onBlur={handleBlur}
                onFocus={handleFocus}
                placeholder="Enter Address"
              />
            </div>
            <div className="">
              {errorStaff.address.message ? (
                <span className="text-danger">
                  {errorStaff.address.message}
                </span>
              ) : null}
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
