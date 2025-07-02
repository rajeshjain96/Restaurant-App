import { useRef, useState } from "react";
import ModalExport from "./ModalExport";
import ExportToExcel from "./ExportToExcel";
import ExportToPDF from "./ExportToPDF";
export default function CommonUtilityBar(props) {
  let { action } = props;
  let { message } = props;
  let { selectedEntity } = props;
  let { flagToggleButton } = props;
  let { filteredList } = props;
  let { mainList } = props;
  let { showInList } = props;
  let [flagExport, setFlagExport] = useState(false);
  const buttonBRef = useRef(null);

  function handleListClick() {
    props.onListClick();
  }
  function handleAddEntityClick() {
    props.onAddEntityClick();
  }
  function handleSearchKeyUp(event) {
    props.onSearchKeyUp(event);
  }

  function handleExportButtonClick(columnSize, exportFileType) {
    //close the modal
    setFlagExport(false);
    // Prepare list for export. exclude image-names, addDate and updateDate.
    let fieldsToBeExported = showInList
      .filter(
        (e) =>
          e.type != "singleFile" &&
          ((e.show && columnSize == "selected") || columnSize == "all")
      )
      .map((e) => e.attribute);

    if (exportFileType == "excel") {
      fieldsToBeExported.unshift("_id");
    }
    let exportList = filteredList.map((e, index) => {
      let keys = Object.keys(e);
      let obj = {};
      for (let key of keys) {
        if (fieldsToBeExported.includes(key)) {
          obj[key] = e[key];
        }
      } //for
      return obj;
    });
    // _id is also required
    if (exportFileType == "excel") {
      handleExcelExportClick(exportList);
    } else if (exportFileType == "pdf") {
      handlePDFExportClick(fieldsToBeExported, exportList);
    }
  }
  function handleExcelExportClick(exportList) {
    let dt = new Date();
    var fileName =
      selectedEntity.name + dt.toDateString() + " " + dt.toLocaleTimeString();
    ExportToExcel(exportList, fileName);
  }
  function handlePDFExportClick(fieldsToBeExported, exportList) {
    let dt = new Date();
    var fileName =
      selectedEntity.name + dt.toDateString() + " " + dt.toLocaleTimeString();
    ExportToPDF(selectedEntity.name, fieldsToBeExported, exportList, fileName);
  }

  function handleExportClick() {
    setFlagExport(true);
  }
  function handleModalCloseClick() {
    setFlagExport(false);
  }

  function handleUploadExcelSheetClick() {
    if (buttonBRef.current) {
      props.onClearSelectedFile();
      buttonBRef.current.click(); // trigger Button B click
    }
  }
  function fileChangedHandler(e) {
    let file = e.target.files[0];
    console.log("..." + file);
    if (buttonBRef.current) {
      buttonBRef.current.value = "";
    }

    if (!file) {
      return;
    }
    // image/jpeg, image/png, application/pdf, video/mp4,
    //application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
    if (
      file.type.indexOf("csv") == -1 &&
      file.type.indexOf("spreadsheet") == -1
    ) {
      props.onExcelFileUploadClick(null, "The file-type should be excel");
    } else {
      // setSelectedFile(file);
      props.onExcelFileUploadClick(file, "");
    }
  }

  return (
    <>
      <div className="container">
        <h4
          className={
            "text-center text-primary  " +
            (flagToggleButton ? "" : "w-75 mx-auto")
          }
          style={{ margin: "0px" }}
        >
          {selectedEntity.name}
        </h4>
        <div
          className={
            "text-center text-primary  " +
            (flagToggleButton ? "" : "w-75 mx-auto")
          }
        >
          {action == "add"
            ? "(Add a Record)"
            : action == "update"
            ? "(Update Record)"
            : "(Showing Records)"}
        </div>
        {(action == "add" || action == "update") && (
          <div className="text-center" style={{ fontSize: "30px" }}>
            <button className="btn btn-primary" onClick={handleListClick}>
              <i className="bi bi-list-columns-reverse"></i>
            </button>
          </div>
        )}
        {action == "list" && selectedEntity.addFacility && (
          <div className="text-center" style={{ fontSize: "30px" }}>
            <span onClick={handleAddEntityClick}>
              <i className="bi bi-file-plus-fill"></i>
            </span>
            &nbsp; &nbsp; &nbsp;{" "}
            <span onClick={handleUploadExcelSheetClick}>
              <i className="bi bi-file-earmark-arrow-up-fill"></i>
            </span>
          </div>
        )}
        <div>
          <input
            className=""
            type="file"
            name="selectedFile"
            ref={buttonBRef}
            onChange={fileChangedHandler}
            style={{ opacity: 0, position: "absolute", zIndex: -1 }}
          />
        </div>
        {action == "list" && (
          <div
            className={
              "row mx-auto justify-content-center text-start p-2 align-items-center my-1 border-top border-1 border-primary"
            }
          >
            {mainList.length != 0 && (
              <div className="col-6 text-center ">
                <input
                  type="search"
                  name=""
                  id=""
                  size="50"
                  onKeyUp={handleSearchKeyUp}
                  onChange={handleSearchKeyUp}
                  className="p-1"
                  placeholder="Search Here"
                />
              </div>
            )}
            {mainList.length != 0 && (
              <div className="col-3 text-center ">
                <select name="" id="">
                  <option value="10">10</option>
                  <option value="10">20</option>
                  <option value="10">50</option>
                  <option value="10">100</option>
                </select>
              </div>
            )}
            {mainList.length != 0 && (
              <div className="col-3 text-center">
                <button className="btn btn-primary" onClick={handleExportClick}>
                  <span style={{ fontSize: "16px" }}>
                    <i className="bi bi-file-earmark-arrow-down-fill"></i>
                  </span>
                </button>
              </div>
            )}
          </div>
        )}
        {message && (
          <div className="message text-danger text-small text-center">
            {message}
          </div>
        )}
        {flagExport && (
          <ModalExport
            modalText={'Do you really want to delete data of  "'}
            btnGroup={["Yes", "No"]}
            onModalCloseClick={handleModalCloseClick}
            onModalButtonCancelClick={handleModalCloseClick}
            onExportButtonClick={handleExportButtonClick}
          />
        )}
      </div>
    </>
  );
}