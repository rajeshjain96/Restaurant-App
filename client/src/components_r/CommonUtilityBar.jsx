import { useState } from "react";
import ModalExport from "./ModalExport";

export default function CommonUtilityBar(props) {
  let { action } = props;
  let { message } = props;
  let { listLength } = props;
  let { selectedEntity } = props;
  let [flagExport, setFlagExport] = useState(false);
  let [exportColumnsSize, setExportColumnSize] = useState("");
  let [exportFileType, setExportFileType] = useState("excel");

  function handleListClick() {
    props.onListClick();
  }
  function handleAddEntityClick() {
    props.onAddEntityClick();
  }
  function handleSearchKeyUp(event) {
    props.onSearchKeyUp(event);
  }
  function handleExcelExportClick() {
    props.onExcelExportClick();
  }
  function handleExportButtonClick() {
    console.log("Yes");
    //close the modal
    setFlagExport(false);
    if (exportFileType == "excel") {
      props.onExcelExportClick(exportColumnsSize);
    } else if (exportFileType == "pdf") {
      props.onPDFExportClick(exportColumnsSize);
    }
  }
  function handlePDFExportClick() {
    props.onPDFExportClick();
  }
  function handlePDFExportClick() {
    props.onPDFExportClick();
  }
  function handleExportClick() {
    setFlagExport(true);
  }
  function handleModalCloseClick() {
    setFlagExport(false);
  }
  function handleColumnSizeSelection(columnSize) {
    console.log(columnSize);

    setExportColumnSize(columnSize);
  }
  function handleFileTypeSelectionChange(fileType) {
    console.log(fileType);
    setExportFileType(fileType);
  }
  return (
    <>
      {action == "list" && (
        <div className="row mx-auto justify-content-center text-start p-3 align-items-center">
          {selectedEntity.addFacility && (
            <div
              className="col-1 "
              style={{ fontSize: "40px" }}
              onClick={handleAddEntityClick}
            >
              <i className="bi bi-file-plus-fill"></i>
            </div>
          )}

          {listLength != 0 && (
            <div className="col-6 text-center ">
              <input
                type="search"
                name=""
                id=""
                size="50"
                onKeyUp={handleSearchKeyUp}
                onChange={handleSearchKeyUp}
                className="p-2"
              />
            </div>
          )}
          {listLength != 0 && (
            <div className="col-2 text-end ">
              <select name="" id="">
                <option value="10">10</option>
                <option value="10">20</option>
                <option value="10">50</option>
                <option value="10">100</option>
              </select>
            </div>
          )}
          <div className="col-1 text-center">
            {/* <button
              className="btn btn-primary"
              onClick={handleExcelExportClick}
            >
              Export To Excel
            </button>{" "}
            <button className="btn btn-primary" onClick={handlePDFExportClick}>
              Export To PDF
            </button> */}
            <button className="btn btn-primary" onClick={handleExportClick}>
              <span style={{ fontSize: "20px" }}>
                <i class="bi bi-file-earmark-arrow-down-fill"></i>
              </span>
            </button>
          </div>
        </div>
      )}
      {(action == "add" || action == "update") && (
        <div className="row w-75 mx-auto justify-content-center text-start p-3 align-items-center">
          <div className="col-2" style={{ fontSize: "40px" }}>
            <button className="btn btn-primary" onClick={handleListClick}>
              <i className="bi bi-list-columns-reverse"></i>
            </button>
          </div>
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
          onColumnSizeSelection={handleColumnSizeSelection}
          onFileTypeSelectionChange={handleFileTypeSelectionChange}
          onExportButtonClick={handleExportButtonClick}
          // onModalButtonClick={handleModalButtonClick}
        />
      )}
    </>
  );
}
