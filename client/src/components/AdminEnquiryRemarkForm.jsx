import { useEffect, useState } from "react";
import fieldValidate from "./FormValidations.js";
import "../formstyles.css";
export default function AdminEnquiryRemarkForm(props) {
  let [enquiryRemark, setEnquiryRemark] = useState("");
  let [errorEnquiryRemark, setErrorEnquiryRemark] = useState(
    props.enquiryRemarkValidations
  );
  let [flagFormInvalid, setFlagFormInvalid] = useState(false);
  let { action } = props;
  let { selectedEntity } = props;
  let { categoryList } = props;
  let { enquiryRemarkSchema } = props;
  let [singleFileList, setSingleFileList] = useState(
    getSingleFileListFromEnquiryRemarkSchema()
  );
  function getSingleFileListFromEnquiryRemarkSchema() {
    let list = [];
    enquiryRemarkSchema.forEach((e, index) => {
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
      // emptyEnquiryRemark.category = props.categoryToRetain;
      // emptyEnquiryRemark.categoryId = props.categoryIdToRetain;
      setEnquiryRemark(props.emptyEnquiryRemark);
    } else if (action === "update") {
      // in edit mode, keep the update button enabled at the beginning
      setFlagFormInvalid(false);
      setEnquiryRemark(props.enquiryRemarkToBeEdited);
    }
  }
  function handleTextFieldChange(event) {
    let name = event.target.name;
    setEnquiryRemark({ ...enquiryRemark, [name]: event.target.value });
    let message = fieldValidate(event, errorEnquiryRemark);
    let errEnquiryRemark = { ...errorEnquiryRemark };
    errorEnquiryRemark[`${name}`].message = message;
    setErrorEnquiryRemark(errEnquiryRemark);
  }
  function handleBlur(event) {
    let name = event.target.name;
    let message = fieldValidate(event, errorEnquiryRemark);
    let errEnquiryRemark = { ...errorEnquiryRemark };
    errorEnquiryRemark[`${name}`].message = message;
    setErrorEnquiryRemark(errEnquiryRemark);
  }
  function handleFocus(event) {
    setFlagFormInvalid(false);
  }
  function checkAllErrors() {
    for (let field in errorEnquiryRemark) {
      if (errorEnquiryRemark[field].message !== "") {
        return true;
      } //if
    } //for
    let errEnquiryRemark = { ...errorEnquiryRemark };
    let flag = false;
    for (let field in enquiryRemark) {
      if (errorEnquiryRemark[field] && enquiryRemark[field] == "") {
        flag = true;
        errEnquiryRemark[field].message = "Required...";
      } //if
    } //for
    if (flag) {
      setErrorEnquiryRemark(errEnquiryRemark);
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
      let pr = { ...enquiryRemark };
      for (let i = 0; i < singleFileList.length; i++) {
        let fAName = singleFileList[i].fileAttributeName;
        if (pr[fAName + "New"]) {
          // image is modified
          // if field-name is image, temporarily in "imageNew" field, new file-name is saved.
          pr[fAName] = pr[fAName + "New"];
          delete pr[fAName + "New"];
        }
      } //for
      setEnquiryRemark(pr);
      props.onFormSubmit(pr);
    } else if (action == "add") {
      props.onFormSubmit(enquiryRemark);
    }
  };
  function handleFileChange(selectedFile, fileIndex, message) {
    setFlagFormInvalid(false);
    if (action == "add") {
      // add datesuffix to file-name
      const timestamp = Date.now();
      const ext = selectedFile.name.split(".").pop();
      const base = selectedFile.name.replace(/\.[^/.]+$/, "");
      const newName = `${base}-${timestamp}.${ext}`;
      // Create a new File object with the new name
      const renamedFile = new File([selectedFile], newName, {
        type: selectedFile.type,
        lastModified: selectedFile.lastModified,
      });
      setEnquiryRemark({
        ...enquiryRemark,
        ["file" + fileIndex]: renamedFile,
        [singleFileList[fileIndex].fileAttributeName]: newName,
      });
      let errEnquiryRemark = { ...errorEnquiryRemark };
      errEnquiryRemark[singleFileList[fileIndex].fileAttributeName].message =
        message;
      setErrorEnquiryRemark(errEnquiryRemark);
      // setErrorEnquiryRemark({ ...errorEnquiryRemark, message: message });
    }
  }
  function handleFileRemove(selectedFile, fileIndex, message) {
    if (action == "add") {
      setFlagFormInvalid(false);
      setEnquiryRemark({
        ...enquiryRemark,
        [singleFileList[fileIndex].fileAttributeName]: "",
      });
      let errEnquiryRemark = { ...errorEnquiryRemark };
      errEnquiryRemark[singleFileList[fileIndex].fileAttributeName].message =
        message;
      setErrorEnquiryRemark(errEnquiryRemark);
    } else if (action == "update") {
      let newFileName = "";
      if (selectedFile) {
        newFileName = selectedFile.name;
      } else {
        // user selected a new file but then deselected
        newFileName = "";
      }
      setEnquiryRemark({
        ...enquiryRemark,
        ["file" + fileIndex]: selectedFile,
        [singleFileList[fileIndex].fileAttributeName + "New"]: newFileName,
      });
      let errEnquiryRemark = { ...errorEnquiryRemark };
      errEnquiryRemark[singleFileList[fileIndex].fileAttributeName].message =
        message;
      setErrorEnquiryRemark(errEnquiryRemark);
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
    setEnquiryRemark({
      ...enquiryRemark,
      // file: file,
      ["file" + fileIndex]: selectedFile,
      [singleFileList[fileIndex].fileAttributeName + "New"]: newFileName,
      // [singleFileList[fileIndex].fileAttributeName]: selectedFile.name,
    });
    let errEnquiryRemark = { ...errorEnquiryRemark };
    errEnquiryRemark[singleFileList[fileIndex].fileAttributeName].message =
      message;
    setErrorEnquiryRemark(errEnquiryRemark);
  }
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
    setEnquiryRemark({
      ...enquiryRemark,
      category: category,
      categoryId: categoryId,
    });
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
          <div className="col-10 my-2">
            <div className="text-bold my-1">
              <label>Remark</label>
            </div>
            <div className=" px-0">
              <input
                type="text"
                className="form-control"
                name="remark"
                value={enquiryRemark.remark}
                onChange={handleTextFieldChange}
                onBlur={handleBlur}
                onFocus={handleFocus}
                placeholder="Enter remarks"
              />
            </div>
            <div className="">
              {errorEnquiryRemark.remark.message ? (
                <span className="text-danger">
                  {errorEnquiryRemark.remark.message}
                </span>
              ) : null}
            </div>
          </div>
          <div className="col-3 my-2">
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
