import { useEffect, useState } from "react";
import fieldValidate from "./FormValidations.js";
import "../formstyles.css";
// import FileUpload from "./SingleFileUpload.jsx";
import SingleFileUpload from "./SingleFileUpload.jsx";
export default function AdminEnquiryFileForm(props) {
  let [enquiryFile, setEnquiryFile] = useState("");
  let [errorEnquiryFile, setErrorEnquiryFile] = useState(
    props.enquiryFileValidations
  );
  let [flagFormInvalid, setFlagFormInvalid] = useState(false);
  let { action } = props;
  let { selectedEntity } = props;
  let { categoryList } = props;
  let { enquiryFileSchema } = props;
  let [singleFileList, setSingleFileList] = useState(
    getSingleFileListFromEnquiryFileSchema()
  );
  function getSingleFileListFromEnquiryFileSchema() {
    let list = [];
    enquiryFileSchema.forEach((e, index) => {
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
      // emptyEnquiryFile.category = props.categoryToRetain;
      // emptyEnquiryFile.categoryId = props.categoryIdToRetain;
      setEnquiryFile(props.emptyEnquiryFile);
    } else if (action === "update") {
      // in edit mode, keep the update button enabled at the beginning
      setFlagFormInvalid(false);
      setEnquiryFile(props.enquiryFileToBeEdited);
    }
  }
  function handleTextFieldChange(event) {
    let name = event.target.name;
    setEnquiryFile({ ...enquiryFile, [name]: event.target.value });
    let message = fieldValidate(event, errorEnquiryFile);
    let errEnquiryFile = { ...errorEnquiryFile };
    errorEnquiryFile[`${name}`].message = message;
    setErrorEnquiryFile(errEnquiryFile);
  }
  function handleBlur(event) {
    let name = event.target.name;
    let message = fieldValidate(event, errorEnquiryFile);
    let errEnquiryFile = { ...errorEnquiryFile };
    errorEnquiryFile[`${name}`].message = message;
    setErrorEnquiryFile(errEnquiryFile);
  }
  function handleFocus(event) {
    setFlagFormInvalid(false);
  }
  function checkAllErrors() {
    for (let field in errorEnquiryFile) {
      if (errorEnquiryFile[field].message !== "") {
        return true;
      } //if
    } //for
    let errEnquiryFile = { ...errorEnquiryFile };
    let flag = false;
    for (let field in enquiryFile) {
      if (errorEnquiryFile[field] && enquiryFile[field] == "") {
        flag = true;
        errEnquiryFile[field].message = "Required...";
      } //if
    } //for
    if (flag) {
      setErrorEnquiryFile(errEnquiryFile);
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
      let pr = { ...enquiryFile };
      for (let i = 0; i < singleFileList.length; i++) {
        let fAName = singleFileList[i].fileAttributeName;
        if (pr[fAName + "New"]) {
          // image is modified
          // if field-name is image, temporarily in "imageNew" field, new file-name is saved.
          pr[fAName] = pr[fAName + "New"];
          delete pr[fAName + "New"];
        }
      } //for
      setEnquiryFile(pr);
      props.onFormSubmit(pr);
    } else if (action == "add") {
      props.onFormSubmit(enquiryFile);
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
      setEnquiryFile({
        ...enquiryFile,
        ["file" + fileIndex]: renamedFile,
        [singleFileList[fileIndex].fileAttributeName]: newName,
      });
      let errEnquiryFile = { ...errorEnquiryFile };
      errEnquiryFile[singleFileList[fileIndex].fileAttributeName].message =
        message;
      setErrorEnquiryFile(errEnquiryFile);
      // setErrorEnquiryFile({ ...errorEnquiryFile, message: message });
    }
  }
  function handleFileRemove(selectedFile, fileIndex, message) {
    if (action == "add") {
      setFlagFormInvalid(false);
      setEnquiryFile({
        ...enquiryFile,
        [singleFileList[fileIndex].fileAttributeName]: "",
      });
      let errEnquiryFile = { ...errorEnquiryFile };
      errEnquiryFile[singleFileList[fileIndex].fileAttributeName].message =
        message;
      setErrorEnquiryFile(errEnquiryFile);
    } else if (action == "update") {
      let newFileName = "";
      if (selectedFile) {
        newFileName = selectedFile.name;
      } else {
        // user selected a new file but then deselected
        newFileName = "";
      }
      setEnquiryFile({
        ...enquiryFile,
        ["file" + fileIndex]: selectedFile,
        [singleFileList[fileIndex].fileAttributeName + "New"]: newFileName,
      });
      let errEnquiryFile = { ...errorEnquiryFile };
      errEnquiryFile[singleFileList[fileIndex].fileAttributeName].message =
        message;
      setErrorEnquiryFile(errEnquiryFile);
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
    setEnquiryFile({
      ...enquiryFile,
      // file: file,
      ["file" + fileIndex]: selectedFile,
      [singleFileList[fileIndex].fileAttributeName + "New"]: newFileName,
      // [singleFileList[fileIndex].fileAttributeName]: selectedFile.name,
    });
    let errEnquiryFile = { ...errorEnquiryFile };
    errEnquiryFile[singleFileList[fileIndex].fileAttributeName].message =
      message;
    setErrorEnquiryFile(errEnquiryFile);
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
    setEnquiryFile({
      ...enquiryFile,
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
          <div className="col-8 my-2">
            <div className="text-bold my-1">
              <label>Description</label>
            </div>
            <div className="px-0">
              <textarea
                className="form-control"
                name="description"
                style={{ height: "100px" }}
                rows={5}
                // cols={20}
                value={enquiryFile.description}
                onChange={handleTextFieldChange}
                onBlur={handleBlur}
                onFocus={handleFocus}
                placeholder="Enter Description"
              ></textarea>
            </div>
            <div className="">
              {errorEnquiryFile.description.message ? (
                <span className="text-danger">
                  {errorEnquiryFile.description.message}
                </span>
              ) : null}
            </div>
          </div>
          <div className="col-4 my-2">
            <div className="text-bold my-1">
              <label>File</label>
            </div>
            <SingleFileUpload
              action={action}
              singleFileList={singleFileList}
              name="resourceFile"
              fileName={enquiryFile.resourceFile}
              onFileChange={handleFileChange}
              onFileChangeUpdateMode={handleFileChangeUpdateMode}
              onCancelChangeImageClick={handleCancelChangeImageClick}
              onFileRemove={handleFileRemove}
            />
            <div className="">
              {errorEnquiryFile.resourceFile.message ? (
                <span className="text-danger">
                  {errorEnquiryFile.resourceFile.message}
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
