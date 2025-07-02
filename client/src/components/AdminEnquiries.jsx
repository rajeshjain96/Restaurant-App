import { useEffect, useState } from "react";
import {
  CommonUtilityBar,
  CheckBoxHeaders,
  ListHeaders,
} from "../external/vite-sdk";
import AdminEnquiryForm from "./AdminEnquiryForm";
import { BeatLoader } from "react-spinners";
import AEnquiry from "./AEnquiry";
import axios from "axios";
import * as XLSX from "xlsx";
import ModalImport from "./ModalImport";
import {
  recordsAddBulk,
  recordsUpdateBulk,
  analyseImportExcelSheet,
} from "../external/vite-sdk";
import { getEmptyObject, getShowInList } from "../external/vite-sdk";

export default function AdminEnquiries(props) {
  let [enquiryList, setEnquiryList] = useState([]);
  let [productList, setProductList] = useState([]);
  let [action, setAction] = useState("list");
  let [filteredEnquiryList, setFilteredEnquiryList] = useState([]);
  let [enquiryToBeEdited, setEnquiryToBeEdited] = useState("");
  let [flagLoad, setFlagLoad] = useState(false);
  let [flagImport, setFlagImport] = useState(false);
  let [message, setMessage] = useState("");
  let [searchText, setSearchText] = useState("");
  let [sortedField, setSortedField] = useState("");
  let [direction, setDirection] = useState("");
  let [sheetData, setSheetData] = useState(null);
  let [selectedFile, setSelectedFile] = useState("");
  let [recordsToBeAdded, setRecordsToBeAdded] = useState([]);
  let [recordsToBeUpdated, setRecordsToBeUpdated] = useState([]);
  let [cntUpdate, setCntUpdate] = useState(0);
  let [cntAdd, setCntAdd] = useState(0);
  let { selectedEntity } = props;
  let { flagFormInvalid } = props;
  let { flagToggleButton } = props;
  let { user } = props;
  let enquirySchema = [
    { attribute: "name", type: "normal" },
    {
      attribute: "product",
      type: "normal",
      relationalData: true,
      list: "productList",
      relatedId: "productId",
    },
    { attribute: "productId", type: "relationalId" },
    { attribute: "siteLocation", type: "normal" },
    { attribute: "mobileNumber", type: "normal" },
    { attribute: "city", type: "normal" },
    { attribute: "region", type: "normal" },
    // The following subcollection is added at the backend
    // {
    //   attribute: "remarks",
    //   type: "array",
    //   defaultValue: [{ remark: "Added", user: user.name }],
    // },
  ];
  let enquiryValidations = {
    name: { message: "", mxLen: 200, mnLen: 4, onlyDigits: false },
    product: { message: "" },
    siteLocation: { message: "", mxLen: 40, mnLen: 4, onlyDigits: false },
    mobileNumber: { message: "", mxLen: 10, mnLen: 10, onlyDigits: true },
    city: { message: "", mxLen: 40, mnLen: 3, onlyDigits: false },
    region: { message: "", mxLen: 40, mnLen: 3, onlyDigits: false },
  };
  let [showInList, setShowInList] = useState(getShowInList(enquirySchema));
  let [emptyEnquiry, setEmptyEnquiry] = useState(getEmptyObject(enquirySchema));
  useEffect(() => {
    getData();
  }, []);
  async function getData() {
    setFlagLoad(true);
    try {
      let response = await axios(import.meta.env.VITE_API_URL + "/enquiries");
      let eList = await response.data;
      response = await axios(import.meta.env.VITE_API_URL + "/products");
      let pList = await response.data;
      // In the enquiryList, add a parameter - product
      eList.forEach((enquiry) => {
        // get category (string) from categoryId
        for (let i = 0; i < pList.length; i++) {
          if (enquiry.productId == pList[i]._id) {
            enquiry.product = pList[i].name;
            break;
          }
        } //for
      });
      setEnquiryList(eList);
      setFilteredEnquiryList(eList);
      setProductList(pList);
    } catch (error) {
      showMessage("Something went wrong, refresh the page");
    }
    setFlagLoad(false);
  }
  async function handleFormSubmit(enquiry) {
    // always add user
    enquiry.user = user.name;
    let message;
    // now remove relational data
    let enquiryForBackEnd = { ...enquiry };
    for (let key in enquiryForBackEnd) {
      enquirySchema.forEach((e, index) => {
        if (key == e.attribute && e.relationalData) {
          delete enquiryForBackEnd[key];
        }
      });
    }
    if (action == "add") {
      setFlagLoad(true);
      try {
        let response = await axios.post(
          import.meta.env.VITE_API_URL + "/enquiries",
          enquiryForBackEnd,
          { headers: { "Content-type": "multipart/form-data" } }
        );
        let addedEnquiry = await response.data; //returned  with id
        // This addedEnquiry has id, addDate, updateDate, but the relational data is lost
        // The original enquiry has got relational data.
        for (let key in enquiry) {
          enquirySchema.forEach((e, index) => {
            if (key == e.attribute && e.relationalData) {
              addedEnquiry[key] = enquiry[key];
            }
          });
        }
        message = "Enquiry added successfully";
        // update the enquiry list now.
        let prList = [...enquiryList];
        prList.push(addedEnquiry);
        prList = prList.sort(
          (a, b) => new Date(b.updateDate) - new Date(a.updateDate)
        );
        setEnquiryList(prList);
        let fprList = [...filteredEnquiryList];
        fprList.push(addedEnquiry);
        fprList = fprList.sort(
          (a, b) => new Date(b.updateDate) - new Date(a.updateDate)
        );
        setFilteredEnquiryList(fprList);
        showMessage(message);
        setAction("list");
      } catch (error) {
        console.log(error);
        showMessage("Something went wrong, refresh the page");
      }
      setFlagLoad(false);
    } //...add
    else if (action == "update") {
      enquiry._id = enquiryToBeEdited._id; // The form does not have id field
      setFlagLoad(true);
      try {
        let response = await axios.put(
          import.meta.env.VITE_API_URL + "/enquiries",
          enquiry,
          { headers: { "Content-type": "multipart/form-data" } }
        );
        enquiry = await response.data;
        message = "Enquiry Updated successfully";
        // update the enquiry list now.
        let prList = enquiryList.map((e, index) => {
          if (e._id == enquiry._id) return enquiry;
          return e;
        });
        prList = prList.sort(
          (a, b) => new Date(b.updateDate) - new Date(a.updateDate)
        );
        let fprList = filteredEnquiryList.map((e, index) => {
          if (e._id == enquiry._id) return enquiry;
          return e;
        });
        fprList = fprList.sort(
          (a, b) => new Date(b.updateDate) - new Date(a.updateDate)
        );
        setEnquiryList(prList);
        setFilteredEnquiryList(fprList);
        showMessage(message);
        setAction("list");
      } catch (error) {
        console.log(error);
        showMessage("Something went wrong, refresh the page");
      }
    } //else ...(update)
    setFlagLoad(false);
  }
  function handleFormCloseClick() {
    props.onFormCloseClick();
  }
  function handleListClick() {
    setAction("list");
  }
  function handleAddEntityClick() {
    setAction("add");
  }
  function handleEditButtonClick(enquiry) {
    setAction("update");
    setEnquiryToBeEdited(enquiry);
  }
  function showMessage(message) {
    setMessage(message);
    window.setTimeout(() => {
      setMessage("");
    }, 3000);
  }
  function handleDeleteButtonClick(ans, enquiry) {
    // await deleteBackendEnquiry(enquiry.id);
    if (ans == "No") {
      // delete operation cancelled
      showMessage("Delete operation cancelled");
      return;
    }
    if (ans == "Yes") {
      // delete operation allowed
      performDeleteOperation(enquiry);
    }
  }
  async function performDeleteOperation(enquiry) {
    try {
      let response = await axios.delete(
        import.meta.env.VITE_API_URL + "/enquiries/" + enquiry._id
      );
      let r = await response.data;
      message = `Enquiry - ${enquiry.name} deleted successfully.`;
      //update the enquiry list now.
      let prList = enquiryList.filter((e, index) => e._id != enquiry._id);
      setEnquiryList(prList);

      let fprList = enquiryList.filter((e, index) => e._id != enquiry._id);
      setFilteredEnquiryList(fprList);
      showMessage(message);
    } catch (error) {
      showMessage("Something went wrong, refresh the page");
    }
    setFlagLoad(false);
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
    let list = [...filteredEnquiryList];
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
    setFilteredEnquiryList(list);
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

    let list = [...filteredEnquiryList];
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
    setFilteredEnquiryList(list);
    setSortedField("updateDate");
  }
  function handleFormTextChangeValidations(message, index) {
    props.onFormTextChangeValidations(message, index);
  }
  function handleSearchKeyUp(event) {
    let searchText = event.target.value;
    setSearchText(searchText);
    performSearchOperation(searchText);
  }
  function performSearchOperation(searchText) {
    let query = searchText.trim();
    if (query.length == 0) {
      setFilteredEnquiryList(enquiryList);
      return;
    }
    let searchedEnquiries = [];
    searchedEnquiries = filterByShowInListAttributes(query);
    setFilteredEnquiryList(searchedEnquiries);
  }
  function filterByName(query) {
    let fList = [];
    for (let i = 0; i < selectedList.length; i++) {
      if (selectedList[i].name.toLowerCase().includes(query.toLowerCase())) {
        fList.push(selectedList[i]);
      }
    } //for
    return fList;
  }
  function filterByShowInListAttributes(query) {
    let fList = [];
    for (let i = 0; i < enquiryList.length; i++) {
      for (let j = 0; j < showInList.length; j++) {
        if (showInList[j].show) {
          let parameterName = showInList[j].attribute;
          if (
            enquiryList[i][parameterName] &&
            enquiryList[i][parameterName]
              .toLowerCase()
              .includes(query.toLowerCase())
          ) {
            fList.push(enquiryList[i]);
            break;
          }
        }
      } //inner for
    } //outer for
    return fList;
  }
  function handleToggleText(index) {
    let sil = [...showInList];
    sil[index].flagReadMore = !sil[index].flagReadMore;
    setShowInList(sil);
  }
  function handleExcelFileUploadClick(file, msg) {
    if (msg) {
      showMessage(message);
      return;
    }
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      const arrayBuffer = event.target.result;
      // Read the workbook from the array buffer
      const workbook = XLSX.read(arrayBuffer, { type: "array" });
      // Assume reading the first sheet
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      // Convert to JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      // const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
      setSheetData(jsonData);
      let result = analyseImportExcelSheet(jsonData, enquiryList);
      if (result.message) {
        showMessage(result.message);
      } else {
        showImportAnalysis(result);
      }
    };
    reader.readAsArrayBuffer(file);
  }
  function showImportAnalysis(result) {
    setCntAdd(result.cntA);
    setCntUpdate(result.cntU);
    setRecordsToBeAdded(result.recordsToBeAdded);
    setRecordsToBeUpdated(result.recordsToBeUpdated);
    //open modal
    setFlagImport(true);
  }
  function handleModalCloseClick() {
    setFlagImport(false);
  }
  async function handleImportButtonClick() {
    setFlagImport(false); // close the modal
    setFlagLoad(true);
    let result;
    try {
      if (recordsToBeAdded.length > 0) {
        result = await recordsAddBulk(
          recordsToBeAdded,
          "enquiries",
          enquiryList,
          import.meta.env.VITE_API_URL
        );
        if (result.success) {
          setEnquiryList(result.updatedList);
          setFilteredEnquiryList(result.updatedList);
        }
        showMessage(result.message);
      }
      if (recordsToBeUpdated.length > 0) {
        result = await recordsUpdateBulk(
          recordsToBeUpdated,
          "enquiries",
          enquiryList,
          import.meta.env.VITE_API_URL
        );
        if (result.success) {
          setEnquiryList(result.updatedList);
          setFilteredEnquiryList(result.updatedList);
        }
        showMessage(result.message);
      } //if
    } catch (error) {
      console.log(error);

      showMessage("Something went wrong, refresh the page");
    }
    setFlagLoad(false);
  }
  function handleClearSelectedFile() {
    setSelectedFile(null);
  }
  if (flagLoad) {
    return (
      <div className="my-5 text-center">
        <BeatLoader size={24} color={"blue"} />
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
        filteredList={filteredEnquiryList}
        mainList={enquiryList}
        showInList={showInList}
        onListClick={handleListClick}
        onAddEntityClick={handleAddEntityClick}
        onSearchKeyUp={handleSearchKeyUp}
        onExcelFileUploadClick={handleExcelFileUploadClick}
        onClearSelectedFile={handleClearSelectedFile}
      />
      {filteredEnquiryList.length == 0 && enquiryList.length != 0 && (
        <div className="text-center">Nothing to show</div>
      )}
      {enquiryList.length == 0 && (
        <div className="text-center">List is empty</div>
      )}
      {(action == "add" || action == "update") && (
        <div className="row">
          <AdminEnquiryForm
            enquirySchema={enquirySchema}
            enquiryValidations={enquiryValidations}
            emptyEnquiry={emptyEnquiry}
            productList={productList}
            selectedEntity={selectedEntity}
            enquiryToBeEdited={enquiryToBeEdited}
            action={action}
            flagFormInvalid={flagFormInvalid}
            onFormSubmit={handleFormSubmit}
            onFormCloseClick={handleFormCloseClick}
            onFormTextChangeValidations={handleFormTextChangeValidations}
          />
        </div>
      )}
      {action == "list" && filteredEnquiryList.length != 0 && (
        <CheckBoxHeaders
          showInList={showInList}
          onListCheckBoxClick={handleListCheckBoxClick}
        />
      )}
      {action == "list" && filteredEnquiryList.length != 0 && (
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
          <ListHeaders
            showInList={showInList}
            sortedField={sortedField}
            direction={direction}
            onHeaderClick={handleHeaderClick}
          />
          <div className="col-1">&nbsp;</div>
        </div>
      )}
      {action == "list" &&
        filteredEnquiryList.length != 0 &&
        filteredEnquiryList.map((e, index) => (
          <AEnquiry
            enquiry={e}
            key={index + 1}
            index={index}
            user={user}
            sortedField={sortedField}
            direction={direction}
            listSize={filteredEnquiryList.length}
            selectedEntity={selectedEntity}
            showInList={showInList}
            onEditButtonClick={handleEditButtonClick}
            onDeleteButtonClick={handleDeleteButtonClick}
            onToggleText={handleToggleText}
          />
        ))}
      {flagImport && (
        <ModalImport
          modalText={"Summary of Bulk Import"}
          additions={recordsToBeAdded}
          updations={recordsToBeUpdated}
          btnGroup={["Yes", "No"]}
          onModalCloseClick={handleModalCloseClick}
          onModalButtonCancelClick={handleModalCloseClick}
          onImportButtonClick={handleImportButtonClick}
        />
      )}
    </>
  );
}
