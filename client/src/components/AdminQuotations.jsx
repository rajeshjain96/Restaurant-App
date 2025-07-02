import { useEffect, useState } from "react";
import CommonUtilityBar from "./CommonUtilityBar";
import AdminQuotationForm from "./AdminQuotationForm";
import { BeatLoader } from "react-spinners";
import AQuotation from "./AQuotation";
import axios from "axios";

export default function AdminQuotations(props) {
  let [quotationList, setQuotationList] = useState([]);
  let [categoryList, setCategoryList] = useState([]);
  let [action, setAction] = useState("list");
  let [filteredQuotationList, setFilteredQuotationList] = useState([]);
  let [quotationToBeEdited, setQuotationToBeEdited] = useState("");
  let [flagLoad, setFlagLoad] = useState(false);
  let [message, setMessage] = useState("");
  let [searchText, setSearchText] = useState("");
  let [sortedField, setSortedField] = useState("");
  let [direction, setDirection] = useState("");
  let { selectedEntity } = props;
  let { flagFormInvalid } = props;
  let { flagToggleButton } = props;

  let quotationSchema = [
    { attribute: "name" },
    {
      attribute: "firstPage",
      type: "singleFile",
      allowedFileType: "image",
      allowedSize: 2,
    },
    {
      attribute: "secondPage",
      type: "singleFile",
      allowedFileType: "pdf",
      allowedSize: 2,
    },
    // {
    //   attribute: "quotationImages",
    //   type: "multiFile",
    //   fileTypes: ["image", "pdf"],
    // },
    // // instock: 1,
    // rating: 5,
  ];
  let quotationValidations = {
    name: { message: "", mxLen: 80, mnLen: 4, onlyDigits: false },
    firstPage: { message: "" },
    secondPage: { message: "" },
  };
  let [showInList, setShowInList] = useState(
    getShowInListFromQuotationSchema()
  );
  let [emptyQuotation, setEmptyQuotation] = useState(getEmptyQuotation());
  function getShowInListFromQuotationSchema() {
    let list = [];
    let cnt = 0;
    quotationSchema.forEach((e, index) => {
      let obj = {};
      if (e.type != "relationalId") {
        // do not show id of relational data.
        obj["attribute"] = e.attribute;
        if (cnt < 5) {
          obj["show"] = true;
        } else {
          obj["show"] = false;
        }
        if (e.type == "singleFile") {
          obj["type"] = "singleFile";
            obj["allowedFileType"] = e.allowedFileType;
        }
        cnt++;
        list.push(obj);
      }
    });
    return list;
  }
  function getEmptyQuotation() {
    let eQuotation = {};
    quotationSchema.forEach((e, index) => {
      if (e["defaultValue"]) {
        eQuotation[e["attribute"]] = e["defaultValue"];
      } else {
        eQuotation[e["attribute"]] = "";
      }
    });
    return eQuotation;
  }
  function getFileListFromQuotationSchema() {
    let list = [];
    quotationSchema.forEach((e, index) => {
      let obj = {};
      if (e.type == "singleFile") {
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
    setFlagLoad(true);
    try {
      let response = await axios(import.meta.env.VITE_API_URL + "/quotations");
      let pList = await response.data;
      setQuotationList(pList);
      setFilteredQuotationList(pList);
    } catch (error) {
      showMessage("Something went wrong, refresh the page");
    }
    setFlagLoad(false);
  }
  async function handleFormSubmit(quotation) {
    let message;
    // now remove relational data
    let quotationForBackEnd = { ...quotation };
    for (let key in quotationForBackEnd) {
      quotationSchema.forEach((e, index) => {
        if (key == e.attribute && e.relationalData) {
          delete quotationForBackEnd[key];
        }
      });
    }
    if (action == "add") {
      // quotation = await addQuotationToBackend(quotation);
      setFlagLoad(true);
      try {
        let response = await axios.post(
          import.meta.env.VITE_API_URL + "/quotations",
          quotationForBackEnd,
          { headers: { "Content-type": "multipart/form-data" } }
        );
        quotation._id = await response.data.insertedId;
        message = "Quotation added successfully";
        // update the quotation list now.
        let prList = [...quotationList];
        prList.push(quotation);
        setQuotationList(prList);

        let fprList = [...filteredQuotationList];
        fprList.push(quotation);
        setFilteredQuotationList(fprList);
        showMessage(message);
        setAction("list");
      } catch (error) {
        showMessage("Something went wrong, refresh the page");
      }
      setFlagLoad(false);
    } //...add
    else if (action == "update") {
      quotation._id = quotationToBeEdited._id; // The form does not have id field
      setFlagLoad(true);
      try {
        let response = await axios.put(
          import.meta.env.VITE_API_URL + "/quotations",
          quotation,
          { headers: { "Content-type": "multipart/form-data" } }
        );
        let r = await response.data;
        message = "Quotation Updated successfully";
        // update the quotation list now.
        let prList = quotationList.map((e, index) => {
          if (e._id == quotation._id) return quotation;
          return e;
        });
        let fprList = filteredQuotationList.map((e, index) => {
          if (e._id == quotation._id) return quotation;
          return e;
        });
        setQuotationList(prList);
        setFilteredQuotationList(fprList);
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
  function handleEditButtonClick(quotation) {
    setAction("update");
    setQuotationToBeEdited(quotation);
  }
  function showMessage(message) {
    setMessage(message);
    window.setTimeout(() => {
      setMessage("");
    }, 3000);
  }
  async function handleDeleteButtonClick(ans, quotation) {
    // await deleteBackendQuotation(quotation.id);
    setFlagLoad(true);
    try {
      let response = await axios.delete(
        import.meta.env.VITE_API_URL + "/quotations/" + quotation._id
      );
      let r = await response.data;
      message = `Quotation - ${quotation.name} deleted successfully.`;
      //update the quotation list now.
      let prList = quotationList.filter((e, index) => e._id != quotation._id);
      setQuotationList(prList);

      let fprList = quotationList.filter((e, index) => e._id != quotation._id);
      setFilteredQuotationList(fprList);
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
    let list = [...filteredQuotationList];
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
    setFilteredQuotationList(list);
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

    let list = [...filteredQuotationList];
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
    setFilteredQuotationList(list);
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
      setFilteredQuotationList(quotationList);
      return;
    }
    let searchedQuotations = [];
    // searchedQuotations = filterByName(query);
    searchedQuotations = filterByShowInListAttributes(query);
    setFilteredQuotationList(searchedQuotations);
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
    for (let i = 0; i < quotationList.length; i++) {
      for (let j = 0; j < showInList.length; j++) {
        if (showInList[j].show) {
          let parameterName = showInList[j].attribute;
          if (
            quotationList[i][parameterName] &&
            quotationList[i][parameterName]
              .toLowerCase()
              .includes(query.toLowerCase())
          ) {
            fList.push(quotationList[i]);
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
        filteredList={filteredQuotationList}
        showInList={showInList}
        onListClick={handleListClick}
        onAddEntityClick={handleAddEntityClick}
        onSearchKeyUp={handleSearchKeyUp}
      />
      {filteredQuotationList.length == 0 && quotationList.length != 0 && (
        <div className="text-center">Nothing to show</div>
      )}
      {quotationList.length == 0 && (
        <div className="text-center">List is empty</div>
      )}
      {(action == "add" || action == "update") && (
        <div className="row">
          <AdminQuotationForm
            quotationSchema={quotationSchema}
            quotationValidations={quotationValidations}
            emptyQuotation={emptyQuotation}
            selectedEntity={selectedEntity}
            quotationToBeEdited={quotationToBeEdited}
            action={action}
            flagFormInvalid={flagFormInvalid}
            onFormSubmit={handleFormSubmit}
            onFormCloseClick={handleFormCloseClick}
            onFormTextChangeValidations={handleFormTextChangeValidations}
          />
        </div>
      )}
      {action == "list" && filteredQuotationList.length != 0 && (
        <div className="row  my-2 mx-auto p-1">
          <div className="col-1">
            <a
              href="#"
              onClick={() => {
                handleSrNoClick();
              }}
            ></a>
          </div>
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
      {action == "list" && filteredQuotationList.length != 0 && (
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
        filteredQuotationList.length != 0 &&
        filteredQuotationList.map((e, index) => (
          <AQuotation
            quotation={e}
            key={index + 1}
            index={index}
            sortedField={sortedField}
            direction={direction}
            listSize={filteredQuotationList.length}
            selectedEntity={selectedEntity}
            showInList={showInList}
            onEditButtonClick={handleEditButtonClick}
            onDeleteButtonClick={handleDeleteButtonClick}
          />
        ))}
    </>
  );
}
