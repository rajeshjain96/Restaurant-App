import { useEffect, useState } from "react";
import fieldValidate from "./FormValidations.js";
import "../formstyles.css";
export default function AdminCategoryForm(props) {
  let [category, setCategory] = useState("");
  let [errorCategory, setErrorCategory] = useState(props.categoryValidations);
  let [flagFormInvalid, setFlagFormInvalid] = useState(false);
  let { action } = props;
  let { selectedEntity } = props;

  useEffect(() => {
    window.scroll(0, 0);
    init();
  }, []);
  function init() {
    let { action } = props;
    if (action === "add") {
      // emptyCategory.category = props.categoryToRetain;
      // emptyCategory.categoryId = props.categoryIdToRetain;
      setCategory(props.emptyCategory);
    } else if (action === "update") {
      // in edit mode, keep the update button enabled at the beginning
      setFlagFormInvalid(false);
      setCategory(props.categoryToBeEdited);
    }
  }
  function handleTextFieldChange(event) {
    let name = event.target.name;
    setCategory({ ...category, [name]: event.target.value });
    let message = fieldValidate(event, errorCategory);
    let errCategory = { ...errorCategory };
    errorCategory[`${name}`].message = message;
    setErrorCategory(errCategory);
  }
  function handleChange(event) {
    let name = event.target.name;
    setCategory({ ...category, [name]: event.target.value });
    // isValid(event);
    let message = fieldValidate(event, errorCategory);
    let errCategory = { ...errorCategory };
    errorCategory[`${name}`].message = message;
    setErrorCategory(errCategory);
  }
  function handleBlur(event) {
    let name = event.target.name;
    let message = fieldValidate(event, errorCategory);
    let errCategory = { ...errorCategory };
    errorCategory[`${name}`].message = message;
    setErrorCategory(errCategory);
  }
  function handleFocus(event) {
    setFlagFormInvalid(false);
  }
  function checkAllErrors() {
    for (let field in errorCategory) {
      if (errorCategory[field].message !== "") {
        return true;
      } //if
    } //for
    let errCategory = { ...errorCategory };
    let flag = false;
    for (let field in category) {
      if (category[field] == "") {
        flag = true;
        errCategory[field].message = "Required...";
      } //if
    } //for
    if (flag) {
      setErrorCategory(errCategory);
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
    props.onFormSubmit(category);
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
                value={category.name}
                onChange={handleTextFieldChange}
                onBlur={handleBlur}
                onFocus={handleFocus}
                placeholder="Enter category name"
              />
            </div>
            <div className="">
              {errorCategory.name.message ? (
                <span className="text-danger">
                  {errorCategory.name.message}
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
                value={category.info}
                onChange={handleTextFieldChange}
                onBlur={handleBlur}
                onFocus={handleFocus}
                placeholder="Enter details about this category "
              />
            </div>
            <div className="">
              {errorCategory.info.message ? (
                <span className="text-danger">
                  {errorCategory.info.message}
                </span>
              ) : null}
            </div>
          </div>
          <div className="col-6 my-2">
            <div className="text-bold my-1">
              <label>Rating</label>
            </div>
            <div className="px-0">
              <input
                type="text"
                className="form-control"
                name="rating"
                value={category.rating}
                onChange={handleTextFieldChange}
                onBlur={handleBlur}
                onFocus={handleFocus}
                placeholder="Enter Rating"
              />
            </div>
            <div className="">
              {errorCategory.rating.message ? (
                <span className="text-danger">
                  {errorCategory.rating.message}
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
                value={category.imageName}
                onChange={handleTextFieldChange}
                onBlur={handleBlur}
                onFocus={handleFocus}
                placeholder="Enter image name"
              />
            </div>
            <div className="">
              {errorCategory.imageName.message ? (
                <span className="text-danger">
                  {errorCategory.imageName.message}
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
