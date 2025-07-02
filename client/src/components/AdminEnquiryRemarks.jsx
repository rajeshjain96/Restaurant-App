import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import {
  CommonUtilityBar,
  CheckBoxHeaders,
  ListHeaders,
} from "../external/vite-sdk";
import AdminEnquiryRemarkForm from "./AdminEnquiryRemarkForm";
import { BeatLoader } from "react-spinners";
import AEnquiryRemark from "./AEnquiryRemark";
import axios from "axios";
import * as XLSX from "xlsx";
import ModalImport from "./ModalImport";
import {
  recordsAddBulk,
  recordsUpdateBulk,
  analyseImportExcelSheet,
} from "../external/vite-sdk";
import { getEmptyObject, getShowInList } from "../external/vite-sdk";
import InfoHeader from "./InfoHeader";
export default function AdminEnquiryRemarks(props) {
  const [params] = useSearchParams();
  const id = params.get("id");
  const productId = params.get("productId");
  const user = params.get("user");
  let selectedEntity = {
    name: "Enquiry Remarks",
    addFacility: true,
    singularName: "Enquiry Remark",
  };
  let [enquiryRemarkList, setEnquiryRemarkList] = useState([]);
  let [filteredEnquiryRemarkList, setFilteredEnquiryRemarkList] = useState([]);
  let [enquiry, setEnquiry] = useState({});
  let [enquiryId, setEnquiryId] = useState({});
  let [categoryList, setCategoryList] = useState([]);
  let [action, setAction] = useState("list");
  let [enquiryRemarkToBeEdited, setEnquiryRemarkToBeEdited] = useState("");
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
  let { flagFormInvalid } = props;
  let { flagToggleButton } = props;
  let enquiryRemarkSchema = [{ attribute: "remark", type: "normal" }];
  let enquiryRemarkValidations = {
    remark: { message: "", mxLen: 200, mnLen: 4, onlyDigits: false },
  };
  let [showInList, setShowInList] = useState(
    getShowInList(enquiryRemarkSchema)
  );
  let [emptyEnquiryRemark, setEmptyEnquiryRemark] = useState(
    getEmptyObject(enquiryRemarkSchema)
  );
  useEffect(() => {
    getData();
  }, []);
  async function getData() {
    setFlagLoad(true);
    try {
      let response1 = await axios(
        import.meta.env.VITE_API_URL + "/enquiries/" + id
      );
      let response2 = await axios(
        import.meta.env.VITE_API_URL + "/products/" + productId
      );
      let enq = response1.data;
      let pr = response2.data;
      if (enq == "Unauthorized") {
        showMessage("Session over. Login again");
      } else {
        enq.product = pr.name;
        setEnquiry(enq);
        setEnquiryId(enq._id);
        setEnquiryRemarkList(enq.remarks);
        setFilteredEnquiryRemarkList(enq.remarks);
        document.title = enq.name;
      }
    } catch (error) {
      console.log(error);
      showMessage("Something went wrong, refresh the page");
    }
    setFlagLoad(false);
  }
  async function handleFormSubmit(enquiryRemark) {
    // always add user
    enquiryRemark.user = user;
    let message;
    // now remove relational data
    let enquiryRemarkForBackEnd = { ...enquiryRemark };
    for (let key in enquiryRemarkForBackEnd) {
      enquiryRemarkSchema.forEach((e, index) => {
        if (key == e.attribute && e.relationalData) {
          delete enquiryRemarkForBackEnd[key];
        }
      });
    }
    if (action == "add") {
      setFlagLoad(true);
      try {
        let response = await axios.post(
          import.meta.env.VITE_API_URL + "/enquiries/" + id + "/remarks",
          enquiryRemarkForBackEnd
          // { headers: { "Content-type": "multipart/form-data" } }
        );

        let addedEnquiryRemark = await response.data; //returned  with id
        // This addedEnquiryRemark has id, addDate, updateDate, but the relational data is lost
        // The original enquiryRemark has got relational data.
        for (let key in enquiryRemark) {
          enquiryRemarkSchema.forEach((e, index) => {
            if (key == e.attribute && e.relationalData) {
              addedEnquiryRemark[key] = enquiryRemark[key];
            }
          });
        }

        message = "Remark added successfully";
        // update the enquiryRemark list now.
        let prList = [...enquiryRemarkList];
        prList.push(addedEnquiryRemark);
        prList = prList.sort(
          (a, b) => new Date(b.updateDate) - new Date(a.updateDate)
        );
        setEnquiryRemarkList(prList);
        let fprList = [...filteredEnquiryRemarkList];
        fprList.push(addedEnquiryRemark);
        fprList = fprList.sort(
          (a, b) => new Date(b.updateDate) - new Date(a.updateDate)
        );
        setFilteredEnquiryRemarkList(fprList);
        // update the list in sorted order of updateDate
        showMessage(message);
        setAction("list");
      } catch (error) {
        console.log(error);

        showMessage("Something went wrong, refresh the page");
      }
      setFlagLoad(false);
    } //...add
    else if (action == "update") {
      enquiryRemark._id = enquiryRemarkToBeEdited._id; // The form does not have id field
      setFlagLoad(true);
      try {
        let response = await axios.put(
          import.meta.env.VITE_API_URL + "/enquiryRemarks",
          enquiryRemarkForBackEnd,
          { headers: { "Content-type": "multipart/form-data" } }
        );
        enquiryRemark = await response.data;
        message = "Enquiry Updated successfully";
        // update the enquiryRemark list now.
        let prList = enquiryRemarkList.map((e, index) => {
          if (e._id == enquiryRemark._id) return enquiryRemark;
          return e;
        });
        prList = prList.sort(
          (a, b) => new Date(b.updateDate) - new Date(a.updateDate)
        );
        let fprList = filteredEnquiryRemarkList.map((e, index) => {
          if (e._id == enquiryRemark._id) return enquiryRemark;
          return e;
        });
        fprList = fprList.sort(
          (a, b) => new Date(b.updateDate) - new Date(a.updateDate)
        );
        setEnquiryRemarkList(prList);
        setFilteredEnquiryRemarkList(fprList);
        showMessage(message);
        setAction("list");
      } catch (error) {
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
  function handleEditButtonClick(enquiryRemark) {
    setAction("update");
    setEnquiryRemarkToBeEdited(enquiryRemark);
  }
  function showMessage(message) {
    setMessage(message);
    window.setTimeout(() => {
      setMessage("");
    }, 3000);
  }
  function handleInvalidDeleteButtonClick(message) {
    showMessage(message);
  }
  function handleDeleteButtonClick(ans, enquiryRemark) {
    if (ans == "No") {
      // delete operation cancelled
      showMessage("Delete operation cancelled");
      return;
    }
    if (ans == "Yes") {
      // delete operation allowed
      performDeleteOperation(enquiryRemark);
    }
  }
  async function performDeleteOperation(enquiryRemark) {
    setFlagLoad(true);
    try {
      let response = await axios.delete(
        import.meta.env.VITE_API_URL +
          "/enquiries/" +
          enquiry._id +
          "/remarks/" +
          enquiryRemark._id
      );
      let r = await response.data;
      message = `Delete operation successful.`;
      //update the enquiryRemark list now.
      let prList = enquiryRemarkList.filter(
        (e, index) => e._id != enquiryRemark._id
      );
      setEnquiryRemarkList(prList);

      let fprList = enquiryRemarkList.filter(
        (e, index) => e._id != enquiryRemark._id
      );
      setFilteredEnquiryRemarkList(fprList);
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
    let list = [...filteredEnquiryRemarkList];
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
    setFilteredEnquiryRemarkList(list);
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

    let list = [...filteredEnquiryRemarkList];
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
    setFilteredEnquiryRemarkList(list);
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
      setFilteredEnquiryRemarkList(enquiryRemarkList);
      return;
    }
    let searchedEnquiryRemarks = [];
    searchedEnquiryRemarks = filterByShowInListAttributes(query);
    setFilteredEnquiryRemarkList(searchedEnquiryRemarks);
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
    for (let i = 0; i < enquiryRemarkList.length; i++) {
      for (let j = 0; j < showInList.length; j++) {
        if (showInList[j].show) {
          let parameterName = showInList[j].attribute;
          if (
            enquiryRemarkList[i][parameterName] &&
            enquiryRemarkList[i][parameterName]
              .toLowerCase()
              .includes(query.toLowerCase())
          ) {
            fList.push(enquiryRemarkList[i]);
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
      let result = analyseImportExcelSheet(jsonData, enquiryRemarkList);
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
          "enquiryRemarks",
          enquiryRemarkList,
          import.meta.env.VITE_API_URL
        );
        if (result.success) {
          setEnquiryRemarkList(result.updatedList);
          setFilteredEnquiryRemarkList(result.updatedList);
        }
        showMessage(result.message);
      }
      if (recordsToBeUpdated.length > 0) {
        result = await recordsUpdateBulk(
          recordsToBeUpdated,
          "enquiryRemarks",
          enquiryRemarkList,
          import.meta.env.VITE_API_URL
        );
        if (result.success) {
          setEnquiryRemarkList(result.updatedList);
          setFilteredEnquiryRemarkList(result.updatedList);
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
  function handleWhatsappClick() {
    let message = "";
    let url =
      `https://api.whatsapp.com/send?phone=${enquiry.mobileNumber}&text=` +
      message;
    window.open(url, "_blank");
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
      <InfoHeader
        enquiry={enquiry}
        message={message}
        onWhatsappClick={handleWhatsappClick}
      />
      <div style={{ marginTop: "100px" }}>
        <CommonUtilityBar
          action={action}
          message={message}
          selectedEntity={selectedEntity}
          flagToggleButton={flagToggleButton}
          filteredList={filteredEnquiryRemarkList}
          mainList={enquiryRemarkList}
          showInList={showInList}
          onListClick={handleListClick}
          onAddEntityClick={handleAddEntityClick}
          onSearchKeyUp={handleSearchKeyUp}
          onExcelFileUploadClick={handleExcelFileUploadClick}
          onClearSelectedFile={handleClearSelectedFile}
        />
      </div>
      {filteredEnquiryRemarkList.length == 0 &&
        enquiryRemarkList.length != 0 && (
          <div className="text-center">Nothing to show</div>
        )}
      {enquiryRemarkList.length == 0 && (
        <div className="text-center">List is empty</div>
      )}
      <div className="container">
        {(action == "add" || action == "update") && (
          <div className="row">
            <AdminEnquiryRemarkForm
              enquiryRemarkSchema={enquiryRemarkSchema}
              enquiryRemarkValidations={enquiryRemarkValidations}
              emptyEnquiryRemark={emptyEnquiryRemark}
              categoryList={categoryList}
              selectedEntity={selectedEntity}
              enquiryRemarkToBeEdited={enquiryRemarkToBeEdited}
              action={action}
              flagFormInvalid={flagFormInvalid}
              onFormSubmit={handleFormSubmit}
              onFormCloseClick={handleFormCloseClick}
              onFormTextChangeValidations={handleFormTextChangeValidations}
            />
          </div>
        )}

        {action == "list" && filteredEnquiryRemarkList.length != 0 && (
          <CheckBoxHeaders
            showInList={showInList}
            onListCheckBoxClick={handleListCheckBoxClick}
          />
        )}
        {action == "list" && filteredEnquiryRemarkList.length != 0 && (
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
          filteredEnquiryRemarkList.length != 0 &&
          filteredEnquiryRemarkList.map((e, index) => (
            <AEnquiryRemark
              enquiryRemark={e}
              key={index + 1}
              index={index}
              sortedField={sortedField}
              direction={direction}
              listSize={filteredEnquiryRemarkList.length}
              selectedEntity={selectedEntity}
              showInList={showInList}
              onEditButtonClick={handleEditButtonClick}
              onDeleteButtonClick={handleDeleteButtonClick}
              onInvalidDeleteButtonClick={handleInvalidDeleteButtonClick}
              onToggleText={handleToggleText}
            />
          ))}
      </div>
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
