import { useEffect, useState } from "react";
import fieldValidate from "./FormValidations.js";
import "../formstyles.css";
import { SingleFileUpload } from "../external/vite-sdk.js";
export default function AdminQuotationForm(props) {
  let [quotation, setQuotation] = useState("");
  let [errorQuotation, setErrorQuotation] = useState(
    props.quotationValidations
  );
  let [flagFormInvalid, setFlagFormInvalid] = useState(false);
  let { action } = props;
  let { selectedEntity } = props;
  let [singleFileList, setSingleFileList] = useState(
    getSingleFileListFromQuotationSchema()
  );
  function getSingleFileListFromQuotationSchema() {
    let list = [];
    props.quotationSchema.forEach((e, index) => {
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
      // emptyQuotation.category = props.categoryToRetain;
      // emptyQuotation.categoryId = props.categoryIdToRetain;
      setQuotation(props.emptyQuotation);
    } else if (action === "update") {
      // in edit mode, keep the update button enabled at the beginning
      setFlagFormInvalid(false);
      setQuotation(props.quotationToBeEdited);
    }
  }
  function handleTextFieldChange(event) {
    let name = event.target.name;
    setQuotation({ ...quotation, [name]: event.target.value });
    let message = fieldValidate(event, errorQuotation);
    let errQuotation = { ...errorQuotation };
    errorQuotation[`${name}`].message = message;
    setErrorQuotation(errQuotation);
  }
  function handleBlur(event) {
    let name = event.target.name;
    let message = fieldValidate(event, errorQuotation);
    let errQuotation = { ...errorQuotation };
    errorQuotation[`${name}`].message = message;
    setErrorQuotation(errQuotation);
  }
  function handleFocus(event) {
    setFlagFormInvalid(false);
  }
  function checkAllErrors() {
    for (let field in errorQuotation) {
      if (errorQuotation[field].message !== "") {
        return true;
      } //if
    } //for
    let errQuotation = { ...errorQuotation };
    let flag = false;
    for (let field in quotation) {
      if (errorQuotation[field] && quotation[field] == "") {
        flag = true;
        errQuotation[field].message = "Required...";
      } //if
    } //for
    if (flag) {
      setErrorQuotation(errQuotation);
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
      let pr = { ...quotation };
      for (let i = 0; i < singleFileList.length; i++) {
        let fAName = singleFileList[i].fileAttributeName;
        if (pr[fAName + "New"]) {
          // image is modified
          // if field-name is image, temporarily in "imageNew" field, new file-name is saved.
          pr[fAName] = pr[fAName + "New"];
          delete pr[fAName + "New"];
        }
      } //for
      setQuotation(pr);
      props.onFormSubmit(pr);
    } else if (action == "add") {
      props.onFormSubmit(quotation);
    }
  };
  function handleFileChange(selectedFile, fileIndex, message) {
    setFlagFormInvalid(false);
    setQuotation({
      ...quotation,
      ["file" + fileIndex]: selectedFile,
      [singleFileList[fileIndex].fileAttributeName]: selectedFile.name,
    });
    let errQuotation = { ...errorQuotation };
    errQuotation[singleFileList[fileIndex].fileAttributeName].message = message;
    setErrorQuotation(errQuotation);
  }
  function handleFileRemove(selectedFile, fileIndex, message) {
    if (action == "add") {
      setFlagFormInvalid(false);

      setQuotation({
        ...quotation,
        [singleFileList[fileIndex].fileAttributeName]: "",
        // [singleFileList[fileIndex].fileAttributeName]: selectedFile.name,
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
        // file: file,
        ["file" + fileIndex]: selectedFile,
        [singleFileList[fileIndex].fileAttributeName + "New"]: newFileName,
        // [singleFileList[fileIndex].fileAttributeName]: selectedFile.name,
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
    setQuotation({
      ...quotation,
      // file: file,
      ["file" + fileIndex]: selectedFile,
      [singleFileList[fileIndex].fileAttributeName + "New"]: newFileName,
      // [singleFileList[fileIndex].fileAttributeName]: selectedFile.name,
    });
    let errQuotation = { ...errorQuotation };
    errQuotation[singleFileList[fileIndex].fileAttributeName].message = message;
    setErrorQuotation(errQuotation);
  }

  // This one is old logic
  // function handleFileChange(file, fileIndex) {
  //   if (action == "add") {
  //     setQuotation({
  //       ...quotation,
  //       file: file,
  //       [singleFileList[fileIndex].fileAttributeName]: file.name,
  //     });
  //   } else if (action == "update") {
  //     // setQuotation({ ...quotation, newFile: file, newImage: file.name });
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
                value={quotation.name}
                onChange={handleTextFieldChange}
                onBlur={handleBlur}
                onFocus={handleFocus}
                placeholder="Enter quotation name"
              />
            </div>
            <div className="">
              {errorQuotation.name.message ? (
                <span className="text-danger">
                  {errorQuotation.name.message}
                </span>
              ) : null}
            </div>
          </div>
          <div className="col-12 my-2">
            <div className="text-bold my-1">
              <label>First Page (Image)</label>
            </div>
            <SingleFileUpload
              singleFileList={singleFileList}
              action={action}
              name="firstPage"
              fileName={quotation.firstPage}
              onFileChange={handleFileChange}
              onFileChangeUpdateMode={handleFileChangeUpdateMode}
              onCancelChangeImageClick={handleCancelChangeImageClick}
              onFileRemove={handleFileRemove}
            />
            <div className="">
              {errorQuotation.firstPage.message ? (
                <span className="text-danger">
                  {errorQuotation.firstPage.message}
                </span>
              ) : null}
            </div>
          </div>
          <div className="col-12 my-2">
            <div className="text-bold my-1">
              <label>Second Page (Pdf)</label>
            </div>
            <SingleFileUpload
              singleFileList={singleFileList}
              action={action}
              name="secondPage"
              fileName={quotation.secondPage}
              onFileChange={handleFileChange}
              onFileChangeUpdateMode={handleFileChangeUpdateMode}
              onCancelChangeImageClick={handleCancelChangeImageClick}
              onFileRemove={handleFileRemove}
            />
            <div className="">
              {errorQuotation.secondPage.message ? (
                <span className="text-danger">
                  {errorQuotation.secondPage.message}
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
