import { useEffect, useState } from "react";
import CommonUtilityBar from "./CommonUtilityBar";
import AdminCustomerForm from "./AdminCustomerForm";
import { BeatLoader } from "react-spinners";
import ACustomer from "./ACustomer";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function AdminCustomers(props) {
  let [customerList, setCustomerList] = useState([]);
  let [action, setAction] = useState("list");
  let [filteredCustomerList, setFilteredCustomerList] = useState([]);
  let [customerToBeEdited, setCustomerToBeEdited] = useState("");
  let [loadFlag, setLoadFlag] = useState(false);
  let [message, setMessage] = useState("");
  let [searchText, setSearchText] = useState("");
  let [sortedField, setSortedField] = useState("");
  let [direction, setDirection] = useState("");
  let { selectedEntity } = props;
  let { flagFormInvalid } = props;
  let { flagToggleButton } = props;
  let customerSchema = [
    { attribute: "name" },
    { attribute: "emailId" },
    { attribute: "mobileNumber" },
    { attribute: "address" },
    { attribute: "companyName" },
    { attribute: "designation" },
    // instock: 1,
    // rating: 5,
  ];
  let customerValidations = {
    name: { message: "", mxLen: 80, mnLen: 4, onlyDigits: false },
    emailId: { message: "", onlyDigits: false },
    mobileNumber: {
      message: "",
      mxLen: 10,
      mnLen: 10,
      onlyDigits: true,
    },
    address: { message: "" },
    companyName: { message: "" },
    designation: { message: "" },
  };
  let [showInList, setShowInList] = useState(getShowInListFromCustomerSchema());
  let [emptyCustomer, setEmptyCustomer] = useState(getEmptyCustomer());
  function getShowInListFromCustomerSchema() {
    let list = [];
    let cnt = 0;
    customerSchema.forEach((e, index) => {
      let obj = {};
      if (e.type != "relationalId") {
        // do not show id of relational data.
        obj["attribute"] = e.attribute;
        if (cnt < 5) {
          obj["show"] = true;
        } else {
          obj["show"] = false;
        }
        cnt++;
        list.push(obj);
      }
    });
    return list;
  }
  function getEmptyCustomer() {
    let eCustomer = {};
    customerSchema.forEach((e, index) => {
      eCustomer[e["attribute"]] = "";
    });
    return eCustomer;
  }
  function getFileListFromCustomerSchema() {
    let list = [];
    customerSchema.forEach((e, index) => {
      let obj = {};
      if (e.type == "file") {
        obj["fileAttributeName"] = e.attribute;
        list.push(obj);
      }
    });
    return list;
  }
  useEffect(() => {
    getData();
  }, []);
  async function getData() {
    setLoadFlag(true);
    let response = await axios("http://localhost:3000/customers");
    let pList = await response.data;

    setCustomerList(pList);
    setFilteredCustomerList(pList);
    setLoadFlag(false);
  }
  async function handleFormSubmit(customer) {
    let message;
    // now remove relational data
    let customerForBackEnd = { ...customer };
    for (let key in customerForBackEnd) {
      customerSchema.forEach((e, index) => {
        if (key == e.attribute && e.relationalData) {
          delete customerForBackEnd[key];
        }
      });
    }
    if (action == "add") {
      // customer = await addCustomerToBackend(customer);

      let response = await axios.post(
        "http://localhost:3000/customers",
        customerForBackEnd,
        { headers: { "Content-type": "multipart/form-data" } }
      );
      customer._id = await response.data.insertedId;
      message = "Customer added successfully";
      // update the customer list now.
      let prList = [...customerList];
      prList.push(customer);
      setCustomerList(prList);

      let fprList = [...filteredCustomerList];
      fprList.push(customer);
      setFilteredCustomerList(fprList);
    } else if (action == "update") {
      customer._id = customerToBeEdited._id; // The form does not have id field
      // await updateBackendCustomer(customer);

      let response = await axios.put(
        "http://localhost:3000/customers",
        customer,
        { headers: { "Content-type": "multipart/form-data" } }
      );
      let r = await response.data;
      message = "Customer Updated successfully";
      // update the customer list now.
      let prList = customerList.map((e, index) => {
        if (e._id == customer._id) return customer;
        return e;
      });
      let fprList = filteredCustomerList.map((e, index) => {
        if (e._id == customer._id) return customer;
        return e;
      });
      setCustomerList(prList);
      setFilteredCustomerList(fprList);
    }
    showMessage(message);
    setAction("list");
  }
  function handleFormCloseClick() {
    // props.onFormCloseClick();
    setAction("list");
  }
  function handleListClick() {
    setAction("list");
  }
  function handleAddEntityClick() {
    setAction("add");
  }
  function handleEditButtonClick(customer) {
    setAction("update");
    setCustomerToBeEdited(customer);
  }
  function showMessage(message) {
    setMessage(message);
    window.setTimeout(() => {
      setMessage("");
    }, 3000);
  }
  async function handleDeleteButtonClick(ans, customer) {
    // await deleteBackendCustomer(customer.id);
    let response = await axios.delete(
      "http://localhost:3000/customers/" + customer._id
    );
    let r = await response.data;
    message = `Customer - ${customer.name} deleted successfully.`;
    //update the customer list now.
    let prList = customerList.filter((e, index) => e._id != customer._id);
    setCustomerList(prList);

    let fprList = customerList.filter((e, index) => e._id != customer._id);
    setFilteredCustomerList(fprList);
    showMessage(message);
  }
  function handleListCheckBoxClick(checked, selectedIndex) {
    // Minimum 1 field should be shown
    let cnt = 0;
    showInList.forEach((e, index) => {
      if (e.show) {
        cnt++;
      }
    });
    if (cnt == 1 && !checked) {
      showMessage("Minimum 1 field should be selected.");
      return;
    }
    if (cnt == 5 && checked) {
      showMessage("Maximum 5 fields can be selected.");
      return;
    }
    let att = [...showInList];
    let a = att.map((e, index) => {
      let p = { ...e };
      if (index == selectedIndex && checked) {
        p.show = true;
      } else if (index == selectedIndex && !checked) {
        p.show = false;
      }
      return p;
    });
    // sEntity.attributes = a;
    setShowInList(a);
  }
  function handleHeaderClick(index) {
    let field = showInList[index].attribute;
    let d = false;
    if (field === sortedField) {
      // same button clicked twice
      d = !direction;
    } else {
      // different field
      d = false;
    }
    let list = [...filteredCustomerList];
    setDirection(d);
    if (d == false) {
      //in ascending order
      list.sort((a, b) => {
        if (a[field] > b[field]) {
          return 1;
        }
        if (a[field] < b[field]) {
          return -1;
        }
        return 0;
      });
    } else {
      //in descending order
      list.sort((a, b) => {
        if (a[field] < b[field]) {
          return 1;
        }
        if (a[field] > b[field]) {
          return -1;
        }
        return 0;
      });
    }
    setFilteredCustomerList(list);
    setSortedField(field);
  }
  function handleSrNoClick() {
    // let field = selectedEntity.attributes[index].id;
    let d = false;
    if (sortedField === "updateDate") {
      d = !direction;
    } else {
      d = false;
    }

    let list = [...filteredCustomerList];
    setDirection(!direction);
    if (d == false) {
      //in ascending order
      list.sort((a, b) => {
        if (new Date(a["updateDate"]) > new Date(b["updateDate"])) {
          return 1;
        }
        if (new Date(a["updateDate"]) < new Date(b["updateDate"])) {
          return -1;
        }
        return 0;
      });
    } else {
      //in descending order
      list.sort((a, b) => {
        if (new Date(a["updateDate"]) < new Date(b["updateDate"])) {
          return 1;
        }
        if (new Date(a["updateDate"]) > new Date(b["updateDate"])) {
          return -1;
        }
        return 0;
      });
    }
    // setSelectedList(list);
    setFilteredCustomerList(list);
    setSortedField("updateDate");
  }
  function handleFormTextChangeValidations(message, index) {
    props.onFormTextChangeValidations(message, index);
  }
  function handleFileUploadChange(file, index) {
    props.onFileUploadChange(file, index);
  }

  function handleSearchKeyUp(event) {
    let searchText = event.target.value;
    setSearchText(searchText);
    performSearchOperation(searchText);
  }
  function performSearchOperation(searchText) {
    let query = searchText.trim();
    if (query.length == 0) {
      setFilteredCustomerList(customerList);
      return;
    }
    let searchedCustomers = [];
    // searchedCustomers = filterByName(query);
    searchedCustomers = filterByShowInListAttributes(query);
    setFilteredCustomerList(searchedCustomers);
  }
  function filterByName(query) {
    let fList = [];
    // console.log(selectedEntity.attributes[0].showInList);

    for (let i = 0; i < selectedList.length; i++) {
      if (selectedList[i].name.toLowerCase().includes(query.toLowerCase())) {
        fList.push(selectedList[i]);
      }
    } //for
    return fList;
  }
  function filterByShowInListAttributes(query) {
    let fList = [];
    for (let i = 0; i < customerList.length; i++) {
      for (let j = 0; j < showInList.length; j++) {
        if (showInList[j].show) {
          let parameterName = showInList[j].attribute;
          if (
            customerList[i][parameterName] &&
            customerList[i][parameterName]
              .toLowerCase()
              .includes(query.toLowerCase())
          ) {
            fList.push(customerList[i]);
            break;
          }
        }
      } //inner for
    } //outer for
    return fList;
  }
  function handleChangeImageClick(index) {
    props.onChangeImageClick(index);
  }
  function handleChangeImageCancelClick(index) {
    props.onChangeImageCancelClick(index);
  }
  function handleFileChangeInUpdateMode(file, fileIndex) {
    let fl = [...fileList];
    fl[fileIndex]["newFileName"] = file.name;
    fl[fileIndex]["newFile"] = file;
    setFileList(fl);
  }
  function handleExcelExportClick() {
    JSONToCSVConvertor(filteredCustomerList, "Nothing", true);
  }
  async function handlePDFExportClick(exportColumnsSize) {
    // const data = [
    //   { name: "Alice", email: "alice@example.com", age: 25 },
    //   { name: "Bob", email: "bob@example.com", age: 30 },
    //   { name: "Charlie", email: "charlie@example.com", age: 28 },
    // ];
    const data = [...filteredCustomerList];
    // const headers = [["Name", "Email", "Age"]];
    let headers = [];
    // add content to header dynamically
    let columnNames = [];
    showInList.forEach((e, index) => {
      if (
        (e.show && exportColumnsSize == "selected") ||
        exportColumnsSize == "all"
      ) {
        columnNames.push(e.attribute);
      }
    });
    // headers.push(columnNames);
    console.log(headers);

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
      doc.text("Customers Data", 40, 50);
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
      let fileName = "Customers - " + new Date() + ".pdf";
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
    headers = headers.filter((e, index) => e.show == true);
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
      "Customers " + dt.toDateString() + " " + dt.toLocaleTimeString();
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
  if (loadFlag) {
    return (
      <div className="my-5 text-center">
        <BeatLoader size={24} color={"red"} />
      </div>
    );
  }
  return (
    <>
      <CommonUtilityBar
        action={action}
        message={message}
        selectedEntity={selectedEntity}
        flagToggleButton={flagToggleButton}
        onListClick={handleListClick}
        onAddEntityClick={handleAddEntityClick}
        onSearchKeyUp={handleSearchKeyUp}
        onExcelExportClick={handleExcelExportClick}
        onPDFExportClick={handlePDFExportClick}
      />
      {filteredCustomerList.length == 0 && customerList.length != 0 && (
        <div className="text-center">Nothing to show</div>
      )}
      {customerList.length == 0 && action == "list" && (
        <div className="text-center">List is empty</div>
      )}
      {(action == "add" || action == "update") && (
        <div className="row">
          <AdminCustomerForm
            customerSchema={customerSchema}
            customerValidations={customerValidations}
            emptyCustomer={emptyCustomer}
            selectedEntity={selectedEntity}
            customerToBeEdited={customerToBeEdited}
            action={action}
            flagFormInvalid={flagFormInvalid}
            onFormSubmit={handleFormSubmit}
            onFormCloseClick={handleFormCloseClick}
            onFormTextChangeValidations={handleFormTextChangeValidations}
            onCancelFormButton={handleFormCloseClick}
          />
        </div>
      )}
      {action == "list" && filteredCustomerList.length != 0 && (
        <div className="row  my-2 mx-auto  p-1">
          {/* <div className="col-1">
            <a
              href="#"
              onClick={() => {
                handleSrNoClick();
              }}
            ></a>
          </div> */}
          {showInList.map((e, index) => (
            <div className="col-2" key={index}>
              <input
                type="checkbox"
                name=""
                id=""
                checked={showInList[index]["show"] == true}
                onChange={(e) => {
                  handleListCheckBoxClick(e.target.checked, index);
                }}
              />{" "}
              {e.attribute.charAt(0).toUpperCase() + e.attribute.slice(1)}
            </div>
          ))}
        </div>
      )}
      {action == "list" && filteredCustomerList.length != 0 && (
        <div className="row   my-2 mx-auto  p-1">
          <div className="col-1">
            <a
              href="#"
              onClick={() => {
                handleSrNoClick();
              }}
            >
              SN.{" "}
              {sortedField == "updateDate" && direction && (
                <i className="bi bi-arrow-up"></i>
              )}
              {sortedField == "updateDate" && !direction && (
                <i className="bi bi-arrow-down"></i>
              )}
            </a>
          </div>
          {showInList.map(
            (e, index) =>
              e.show && (
                <div className={"col-2 "} key={index}>
                  <a
                    href="#"
                    className={
                      sortedField == e.attribute
                        ? " text-large text-danger"
                        : ""
                    }
                    onClick={() => {
                      handleHeaderClick(index);
                    }}
                  >
                    {e.attribute.charAt(0).toUpperCase() + e.attribute.slice(1)}{" "}
                    {sortedField == e.attribute && direction && (
                      <i className="bi bi-arrow-up"></i>
                    )}
                    {sortedField == e.attribute && !direction && (
                      <i className="bi bi-arrow-down"></i>
                    )}
                  </a>
                </div>
              )
          )}
          <div className="col-1">&nbsp;</div>
        </div>
      )}
      {action == "list" &&
        filteredCustomerList.length != 0 &&
        filteredCustomerList.map((e, index) => (
          <ACustomer
            customer={e}
            key={index + 1}
            index={index}
            sortedField={sortedField}
            direction={direction}
            listSize={filteredCustomerList.length}
            selectedEntity={selectedEntity}
            showInList={showInList}
            onEditButtonClick={handleEditButtonClick}
            onDeleteButtonClick={handleDeleteButtonClick}
          />
        ))}
    </>
  );
}
