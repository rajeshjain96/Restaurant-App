import { useRef, useState } from "react";
import ModalExport from "./ModalExport";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function CommonUtilityBar(props) {
  let { action } = props;
  let { message } = props;
  let { listLength } = props;
  let { selectedEntity } = props;
  let { flagToggleButton } = props;
  let { filteredList } = props;
  let { showInList } = props;
  let [flagExport, setFlagExport] = useState(false);
  let [exportColumnsSize, setExportColumnSize] = useState("all");
  let [exportFileType, setExportFileType] = useState("excel");
  let [flagFileUpload, setFlagFileUpload] = useState(false);
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
  // function handleExcelExportClick() {
  //   props.onExcelExportClick();
  // }
  function handleExportButtonClick() {
    //close the modal
    setFlagExport(false);
    if (exportFileType == "excel") {
      handleExcelExportClick();
    } else if (exportFileType == "pdf") {
      handlePDFExportClick();
    }
  }
  function handleExcelExportClick() {
    JSONToCSVConvertor(filteredList, "Nothing", true);
  }
  async function handlePDFExportClick() {
    const data = [...filteredList];
    let headers = [];
    // add content to header dynamically
    let columnNames = [];
    showInList.forEach((e, index) => {
      if (
        exportColumnsSize == "all" ||
        (e.show && exportColumnsSize == "selected")
      ) {
        columnNames.push(e.attribute);
      }
    });
    // headers.push(columnNames);
    // const body = data.map((row) => [row.name, row.email, row.age.toString()]);
    let body = data.map((row, index) => {
      let a = [];
      for (let i = 0; i < columnNames.length; i++) {
        a.push(row[columnNames[i]].toString());
      } //for
      return a;
    });
    // Make first letter of headers capital
    columnNames = columnNames.map((e, index) => {
      let s = e.charAt(0).toUpperCase() + e.slice(1);
      return s;
    });
    // now push to headers
    headers.push(columnNames);

    const doc = new jsPDF({
      orientation: "landscape",
      unit: "pt",
      format: "A4",
    });
    const pageWidth = doc.internal.pageSize.getWidth();

    // Logo (optional)
    const logo = new Image();
    logo.src = "/images/fruits/anjeer.jpg";
    logo.onload = () => {
      doc.addImage(logo, "JPEG", pageWidth - 140, 20, 100, 50);
      doc.setFontSize(18);
      doc.text(selectedEntity.name + " Data", 40, 50);
      doc.setFontSize(12);
      doc.text("Generated on: " + new Date().toLocaleDateString(), 40, 70);

      autoTable(doc, {
        head: headers,
        body: body,
        startY: 100,
        theme: "grid",
        headStyles: { fillColor: [0, 102, 204], textColor: 255 },
        bodyStyles: { fillColor: [245, 245, 245] },
        alternateRowStyles: { fillColor: [255, 255, 255] },
        styles: { fontSize: 10, cellPadding: 6 },
        didDrawPage: (data) => {
          const pageCount = doc.internal.getNumberOfPages();
          const pageHeight = doc.internal.pageSize.getHeight();
          doc.setFontSize(9);
          doc.text(
            `Page ${
              doc.internal.getCurrentPageInfo().pageNumber
            } of ${pageCount}`,
            pageWidth - 100,
            pageHeight - 20
          );
        },
      });
      let fileName = selectedEntity.name + " " + new Date() + ".pdf";
      // doc.save("hidden-table.pdf");
      doc.save(fileName);
    };
  }
  function JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel) {
    //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
    var arrData = typeof JSONData != "object" ? JSON.parse(JSONData) : JSONData;
    var arrData = JSONData;
    //Set Report title in first row or line
    CSV += ReportTitle + "\r\n\n";
    let headers = [...showInList];
    // Remove all other than showInList

    //  showInList.forEach((e, index) => {
    //   if (
    //     exportColumnsSize == "all" ||
    //     (e.show && exportColumnsSize == "selected")
    //   ) {
    //     columnNames.push(e.attribute);
    //   }
    // });
    headers = headers.filter(
      (e, index) =>
        exportColumnsSize == "all" ||
        (e.show && exportColumnsSize == "selected")
    );
    if (ShowLabel) {
      var row = "";
      var CSV = "";
      // Add Sr. No.
      row += "Sr. No., ";
      //This loop will extract the label from 1st index of on array
      for (let i = 0; i < headers.length; i++) {
        //Now convert each value to string and comma-seprated
        row += headers[i].attribute + ",";
      }
      //append Label row with line break
      CSV += row + "\r\n";
    }
    //1st loop is to extract each row
    let data;
    for (var i = 0; i < arrData.length; i++) {
      var row = '"' + (i + 1) + '",';
      //2nd loop will extract each column and convert it in string comma-seprated
      for (let e of headers) {
        data = arrData[i][e["attribute"]];
        row += '"' + data + '",';
      } //for
      // row.slice(0, row.length - 1);
      //add a line break after each row
      CSV += row + "\r\n";
    }
    if (CSV == "") {
      alert("Invalid data");
      return;
    }
    let dt = new Date();

    //Generate a file name
    var fileName =
      selectedEntity.name + dt.toDateString() + " " + dt.toLocaleTimeString();
    //  + ".xls";
    //this will remove the blank-spaces from the title and replace it with an underscore
    // fileName += ReportTitle.replace(/ /g, "_");
    //Initialize file format you want csv or xls
    // var uri = "data:text/csv;charset=utf-8," + escape(CSV);
    var uri = "data:text/csv;charset=utf-8," + CSV;
    // Now the little tricky part.
    // you can use either>> window.open(uri);
    // but this will not work in some browsers
    // or you will not get the correct file extension
    //this trick will generate a temp <a /> tag
    var link = document.createElement("a");
    link.href = uri;
    //set the visibility hidden so it will not effect on your web-layout
    link.style = "visibility:hidden";
    link.download = fileName + ".csv";
    //this part will append the anchor tag and remove it after automatic click
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function handleExportClick() {
    setFlagExport(true);
  }
  function handleModalCloseClick() {
    setFlagExport(false);
  }
  function handleColumnSizeSelection(columnSize) {
    setExportColumnSize(columnSize);
  }
  function handleFileTypeSelectionChange(fileType) {
    setExportFileType(fileType);
  }
  function handleUploadExcelSheetClick() {
    if (buttonBRef.current) {
      buttonBRef.current.click(); // trigger Button B click
    }
  }
  function fileChangedHandler(event) {
    let file = event.target.files[0];
    let message = "";
    if (!file) {
      // setMessage("");
      setPreviewImage("");
      return;
    }
    // image/jpeg, image/png, application/pdf, video/mp4,
    //application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
    if (file.type.indexOf("spreadsheet") == -1) {
      message = "The file-type should be excel";
      setFile(file);
    } else {
      setFile(file);
    }
    // props.onFileChangeUpdateMode(file, fileIndex, message);
  }
  return (
    <>
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
          name="file"
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
          {listLength != 0 && (
            <div className="col-6 text-center ">
              <input
                type="search"
                name=""
                id=""
                size="50"
                onKeyUp={handleSearchKeyUp}
                onChange={handleSearchKeyUp}
                className="p-1"
              />
            </div>
          )}
          {listLength != 0 && (
            <div className="col-3 text-center ">
              <select name="" id="">
                <option value="10">10</option>
                <option value="10">20</option>
                <option value="10">50</option>
                <option value="10">100</option>
              </select>
            </div>
          )}
          <div className="col-3 text-center">
            <button className="btn btn-primary" onClick={handleExportClick}>
              <span style={{ fontSize: "16px" }}>
                <i className="bi bi-file-earmark-arrow-down-fill"></i>
              </span>
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
