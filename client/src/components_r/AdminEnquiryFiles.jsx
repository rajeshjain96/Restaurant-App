import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import CommonUtilityBar from "./CommonUtilityBar";
import AdminEnquiryFileForm from "./AdminEnquiryFileForm";
import { BeatLoader } from "react-spinners";
import AEnquiryFile from "./AEnquiryFile";
import axios from "axios";
import * as XLSX from "xlsx";
import ModalImport from "./ModalImport";
import analyseImportExcelSheet from "./AnalyseImportExcelSheet";
import recordsAddBulk from "./RecordsAddBulk";
import recordsUpdateBulk from "./RecordsUpdateBulk";
import { getEmptyObject, getShowInList } from "../utilities";
import InfoHeader from "./infoHeader";
export default function AdminEnquiryFiles(props) {
  const [params] = useSearchParams();
  const id = params.get("id");
  const productId = params.get("productId");
  const user = params.get("user");

  let selectedEntity = {
    name: "Enquiry Resources",
    addFacility: true,
    singularName: "Enquiry Resource",
  };
  let [enquiryFileList, setEnquiryFileList] = useState([]);
  let [filteredEnquiryFileList, setFilteredEnquiryFileList] = useState([]);
  let [enquiry, setEnquiry] = useState({});
  let [enquiryId, setEnquiryId] = useState({});
  let [categoryList, setCategoryList] = useState([]);
  let [action, setAction] = useState("list");
  let [enquiryFileToBeEdited, setEnquiryFileToBeEdited] = useState("");
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

  let enquiryFileSchema = [
    { attribute: "description", type: "normal" },
    {
      attribute: "resourceFile",
      type: "singleFile",
      // allowedFileType: "image",
      allowedFileType: "all",
      allowedSize: 2,
    },
  ];
  let enquiryFileValidations = {
    description: { message: "", mxLen: 200, mnLen: 4, onlyDigits: false },
    resourceFile: { message: "" },
  };
  let [showInList, setShowInList] = useState(getShowInList(enquiryFileSchema));
  let [emptyEnquiryFile, setEmptyEnquiryFile] = useState(
    getEmptyObject(enquiryFileSchema)
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
        setEnquiryFileList(enq.files);
        setFilteredEnquiryFileList(enq.files);
        document.title = enq.name;
      }
    } catch (error) {
      console.log(error);
      showMessage("Something went wrong, refresh the page");
    }
    setFlagLoad(false);
  }
  async function handleFormSubmit(enquiryFile) {
    // always add user
    enquiryFile.user = user;
    let message;
    // now remove relational data
    let enquiryFileForBackEnd = { ...enquiryFile };
    for (let key in enquiryFileForBackEnd) {
      enquiryFileSchema.forEach((e, index) => {
        if (key == e.attribute && e.relationalData) {
          delete enquiryFileForBackEnd[key];
        }
      });
    }
    if (action == "add") {
      // enquiryFile = await addEnquiryFileToBackend(enquiryFile);
      setFlagLoad(true);
      try {
        let response = await axios.post(
          import.meta.env.VITE_API_URL + "/enquiries/" + id + "/resourceFiles",
          enquiryFileForBackEnd,
          { headers: { "Content-type": "multipart/form-data" } }
        );

        let addedEnquiryFile = await response.data; //returned  with id
        // This addedEnquiryFile has id, addDate, updateDate, but the relational data is lost
        // The original enquiryFile has got relational data.
        for (let key in enquiryFile) {
          enquiryFileSchema.forEach((e, index) => {
            if (key == e.attribute && e.relationalData) {
              addedEnquiryFile[key] = enquiryFile[key];
            }
          });
        }

        message = "EnquiryFile added successfully";
        // update the enquiryFile list now.
        let prList = [...enquiryFileList];
        prList.push(addedEnquiryFile);
        prList = prList.sort(
          (a, b) => new Date(b.updateDate) - new Date(a.updateDate)
        );
        setEnquiryFileList(prList);
        let fprList = [...filteredEnquiryFileList];
        fprList.push(addedEnquiryFile);
        fprList = fprList.sort(
          (a, b) => new Date(b.updateDate) - new Date(a.updateDate)
        );
        setFilteredEnquiryFileList(fprList);
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
      enquiryFile._id = enquiryFileToBeEdited._id; // The form does not have id field
      setFlagLoad(true);
      try {
        let response = await axios.put(
          import.meta.env.VITE_API_URL + "/enquiryFiles",
          enquiryFileForBackEnd,
          { headers: { "Content-type": "multipart/form-data" } }
        );
        enquiryFile = await response.data;
        message = "EnquiryFile Updated successfully";
        // update the enquiryFile list now.
        let prList = enquiryFileList.map((e, index) => {
          if (e._id == enquiryFile._id) return enquiryFile;
          return e;
        });
        prList = prList.sort(
          (a, b) => new Date(b.updateDate) - new Date(a.updateDate)
        );
        let fprList = filteredEnquiryFileList.map((e, index) => {
          if (e._id == enquiryFile._id) return enquiryFile;
          return e;
        });
        fprList = fprList.sort(
          (a, b) => new Date(b.updateDate) - new Date(a.updateDate)
        );
        setEnquiryFileList(prList);
        setFilteredEnquiryFileList(fprList);
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
  function handleEditButtonClick(enquiryFile) {
    setAction("update");
    setEnquiryFileToBeEdited(enquiryFile);
  }
  function showMessage(message) {
    setMessage(message);
    window.setTimeout(() => {
      setMessage("");
    }, 3000);
  }
  function handleDeleteButtonClick(ans, enquiryFile) {
    if (ans == "No") {
      // delete operation cancelled
      showMessage("Delete operation cancelled");
      return;
    }
    if (ans == "Yes") {
      // delete operation allowed
      performDeleteOperation(enquiryFile);
    }
  }
  async function performDeleteOperation(enquiryFile) {
    setFlagLoad(true);
    try {
      let response = await axios.delete(
        import.meta.env.VITE_API_URL +
          "/enquiries/" +
          enquiry._id +
          "/resourceFiles/" +
          enquiryFile._id
      );
      let r = await response.data;
      message = `Delete operation successful.`;
      //update the enquiryFile list now.
      let prList = enquiryFileList.filter(
        (e, index) => e._id != enquiryFile._id
      );
      setEnquiryFileList(prList);

      let fprList = enquiryFileList.filter(
        (e, index) => e._id != enquiryFile._id
      );
      setFilteredEnquiryFileList(fprList);
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
    let list = [...filteredEnquiryFileList];
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
    setFilteredEnquiryFileList(list);
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

    let list = [...filteredEnquiryFileList];
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
    setFilteredEnquiryFileList(list);
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
      setFilteredEnquiryFileList(enquiryFileList);
      return;
    }
    let searchedEnquiryFiles = [];
    searchedEnquiryFiles = filterByShowInListAttributes(query);
    setFilteredEnquiryFileList(searchedEnquiryFiles);
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
    for (let i = 0; i < enquiryFileList.length; i++) {
      for (let j = 0; j < showInList.length; j++) {
        if (showInList[j].show) {
          let parameterName = showInList[j].attribute;
          if (
            enquiryFileList[i][parameterName] &&
            enquiryFileList[i][parameterName]
              .toLowerCase()
              .includes(query.toLowerCase())
          ) {
            fList.push(enquiryFileList[i]);
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
      let result = analyseImportExcelSheet(jsonData, enquiryFileList);
      if (result.message) {
        showMessage(result.message);
      } else {
        showImportAnalysis(result);
      }
      // analyseSheetData(jsonData, enquiryFileList);
    };
    // reader.readAsBinaryString(file);
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
          "enquiryFiles",
          enquiryFileList
        );
        if (result.success) {
          setEnquiryFileList(result.updatedList);
          setFilteredEnquiryFileList(result.updatedList);
        }
        showMessage(result.message);
      }
      if (recordsToBeUpdated.length > 0) {
        result = await recordsUpdateBulk(
          recordsToBeUpdated,
          "enquiryFiles",
          enquiryFileList
        );
        if (result.success) {
          setEnquiryFileList(result.updatedList);
          setFilteredEnquiryFileList(result.updatedList);
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
          filteredList={filteredEnquiryFileList}
          mainList={enquiryFileList}
          showInList={showInList}
          onListClick={handleListClick}
          onAddEntityClick={handleAddEntityClick}
          onSearchKeyUp={handleSearchKeyUp}
          onExcelFileUploadClick={handleExcelFileUploadClick}
          onClearSelectedFile={handleClearSelectedFile}
        />
      </div>
      {filteredEnquiryFileList.length == 0 && enquiryFileList.length != 0 && (
        <div className="text-center">Nothing to show</div>
      )}
      {enquiryFileList.length == 0 && (
        <div className="text-center">List is empty</div>
      )}
      <div className="container">
        {(action == "add" || action == "update") && (
          <div className="row">
            <AdminEnquiryFileForm
              enquiryFileSchema={enquiryFileSchema}
              enquiryFileValidations={enquiryFileValidations}
              emptyEnquiryFile={emptyEnquiryFile}
              categoryList={categoryList}
              selectedEntity={selectedEntity}
              enquiryFileToBeEdited={enquiryFileToBeEdited}
              action={action}
              flagFormInvalid={flagFormInvalid}
              onFormSubmit={handleFormSubmit}
              onFormCloseClick={handleFormCloseClick}
              onFormTextChangeValidations={handleFormTextChangeValidations}
            />
          </div>
        )}
        {action == "list" && filteredEnquiryFileList.length != 0 && (
          <div className="row  my-2 mx-auto p-1">
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
        {action == "list" && filteredEnquiryFileList.length != 0 && (
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
                      {e.attribute.charAt(0).toUpperCase() +
                        e.attribute.slice(1)}{" "}
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
          filteredEnquiryFileList.length != 0 &&
          filteredEnquiryFileList.map((e, index) => (
            <AEnquiryFile
              enquiryFile={e}
              key={index + 1}
              index={index}
              sortedField={sortedField}
              direction={direction}
              listSize={filteredEnquiryFileList.length}
              selectedEntity={selectedEntity}
              showInList={showInList}
              onEditButtonClick={handleEditButtonClick}
              onDeleteButtonClick={handleDeleteButtonClick}
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
