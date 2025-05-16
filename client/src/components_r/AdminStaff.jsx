import { useEffect, useState } from "react";
import CommonUtilityBar from "./CommonUtilityBar";
import AdminStaffForm from "./AdminStaffForm";
import { BeatLoader } from "react-spinners";
import AStaff from "./AStaff";
import axios from "axios";

export default function AdminStaff(props) {
  let [staffList, setStaffList] = useState([]);
  let [categoryList, setCategoryList] = useState([]);
  let [action, setAction] = useState("list");
  let [filteredStaffList, setFilteredStaffList] = useState([]);
  let [staffToBeEdited, setStaffToBeEdited] = useState("");
  let [loadFlag, setLoadFlag] = useState(false);
  let [message, setMessage] = useState("");
  let [searchText, setSearchText] = useState("");
  let [sortedField, setSortedField] = useState("");
  let [direction, setDirection] = useState("");
  let { selectedEntity } = props;
  let { flagFormInvalid } = props;
  let staffSchema = [
    { attribute: "name" },
    // {
    //   attribute: "staffCategory",
    //   relationalData: true,
    //   list: "staffCategoryList",
    //   relatedId: "categoryId",
    // },
    // { attribute: "categoryId", type: "select" },
    { attribute: "mobileNumber" },
    { attribute: "address" },
  ];
  let staffValidations = {
    name: { message: "", mxLen: 80, mnLen: 4, onlyDigits: false },
    mobileNumber: { message: "", mxLen: 10, mnLen: 10, onlyDigits: true },
    address: {
      message: "",
      mxLen: 30,
      mnLen: 2,
      onlyDigits: false,
    },
  };
  let [showInList, setShowInList] = useState(getListFromStaffSchema());
  let [emptyStaff, setEmptyStaff] = useState(getEmptyStaff());
  function getListFromStaffSchema() {
    let list = [];
    let cnt = 0;
    staffSchema.forEach((e, index) => {
      let obj = {};
      if (!e.type) {
        // do not show id of relational data.
        obj["attribute"] = e.attribute;
        if (cnt < 4) {
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
  function getEmptyStaff() {
    let eStaff = {};
    staffSchema.forEach((e, index) => {
      eStaff[e["attribute"]] = "";
    });
    return eStaff;
  }
  useEffect(() => {
    getData();
  }, []);
  async function getData() {
    setLoadFlag(true);
    let response = await axios("http://localhost:3000/staff");
    let pList = await response.data;
    response = await axios("http://localhost:3000/categories");
    let cList = await response.data;
    // In the staffList, add a parameter - category
    pList.forEach((staff, index) => {
      // get category (string) from categoryId
      for (let i = 0; i < cList.length; i++) {
        if (staff.categoryId == cList[i]._id) {
          staff.category = cList[i].name;
          break;
        }
      } //for
    });
    setStaffList(pList);
    setFilteredStaffList(pList);
    setCategoryList(cList);
    setLoadFlag(false);
  }
  async function handleFormSubmit(staff) {
    let message;
    // now remove relational data
    let staffForBackEnd = { ...staff };
    for (let key in staffForBackEnd) {
      staffSchema.forEach((e, index) => {
        if (key == e.attribute && e.relationalData) {
          delete staffForBackEnd[key];
        }
      });
    }
    if (action == "add") {
      // staff = await addStaffToBackend(staff);
      let response = await axios.post(
        "http://localhost:3000/staff",
        staffForBackEnd
      );
      staff._id = await response.data.insertedId;
      message = "Staff added successfully";
      // update the staff list now.
      let prList = [...staffList];
      prList.push(staff);
      setStaffList(prList);

      let fprList = [...filteredStaffList];
      fprList.push(staff);
      setFilteredStaffList(fprList);
    } else if (action == "update") {
      staff._id = staffToBeEdited._id; // The form does not have id field
      // await updateBackendStaff(staff);
      let response = await axios.put(
        "http://localhost:3000/staff",
        staffForBackEnd
      );
      let r = await response.data;
      message = "Staff Updated successfully";
      // update the staff list now.
      let prList = staffList.map((e, index) => {
        if (e._id == staff._id) return staff;
        return e;
      });
      let fprList = filteredStaffList.map((e, index) => {
        if (e._id == staff._id) return staff;
        return e;
      });
      setStaffList(prList);
      setFilteredStaffList(fprList);
    }
    showMessage(message);
    setAction("list");
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
  function handleEditButtonClick(staff) {
    setAction("update");
    setStaffToBeEdited(staff);
  }
  function showMessage(message) {
    setMessage(message);
    window.setTimeout(() => {
      setMessage("");
    }, 3000);
  }
  async function handleDeleteButtonClick(ans, staff) {
    // await deleteBackendStaff(staff.id);
    let response = await axios.delete(
      "http://localhost:3000/staff/" + staff._id
    );
    let r = await response.data;
    message = `Staff - ${staff.name} deleted successfully.`;
    //update the staff list now.
    let prList = staffList.filter((e, index) => e._id != staff._id);
    setStaffList(prList);

    let fprList = staffList.filter((e, index) => e._id != staff._id);
    setFilteredStaffList(fprList);
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
    let list = [...filteredStaffList];
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
    setFilteredStaffList(list);
    setSortedField(field);
  }
  function handleSrNoClick() {
    props.onSrNoClick();
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
      setFilteredStaffList(staffList);
      return;
    }
    let searchedStaff = [];
    // searchedStaff = filterByName(query);
    searchedStaff = filterByShowInListAttributes(query);
    setFilteredStaffList(searchedStaff);
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
    for (let i = 0; i < staffList.length; i++) {
      for (let j = 0; j < showInList.length; j++) {
        if (showInList[j].show) {
          let parameterName = showInList[j].attribute;
          if (
            staffList[i][parameterName] &&
            staffList[i][parameterName]
              .toLowerCase()
              .includes(query.toLowerCase())
          ) {
            fList.push(staffList[i]);
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
  if (loadFlag) {
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
        onListClick={handleListClick}
        onAddEntityClick={handleAddEntityClick}
        onSearchKeyUp={handleSearchKeyUp}
      />
      {filteredStaffList.length == 0 && staffList.length != 0 && (
        <div className="text-center">Nothing to show</div>
      )}
      {staffList.length == 0 && (
        <div className="text-center">List is empty</div>
      )}
      {(action == "add" || action == "update") && (
        <div className="row">
          <AdminStaffForm
            staffSchema={staffSchema}
            staffValidations={staffValidations}
            emptyStaff={emptyStaff}
            categoryList={categoryList}
            selectedEntity={selectedEntity}
            staffToBeEdited={staffToBeEdited}
            action={action}
            flagFormInvalid={flagFormInvalid}
            onFormSubmit={handleFormSubmit}
            onFormCloseClick={handleFormCloseClick}
            onFormTextChangeValidations={handleFormTextChangeValidations}
          />
        </div>
      )}
      {action == "list" && filteredStaffList.length != 0 && (
        <div className="row  my-2 mx-auto border border-2 border-secondary p-1">
          <div className="col-1">
            <a
              href="#"
              onClick={() => {
                handleSrNoClick();
              }}
            >
              S N.{" "}
              {sortedField == "updateDate" && direction && (
                <i className="bi bi-arrow-up"></i>
              )}
              {sortedField == "updateDate" && !direction && (
                <i className="bi bi-arrow-down"></i>
              )}
            </a>
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
      {action == "list" && filteredStaffList.length != 0 && (
        <div className="row   my-2 mx-auto  p-1">
          <div className="col-1">
            <a
              href="#"
              onClick={() => {
                handleSrNoClick();
              }}
            >
              S N.{" "}
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
        filteredStaffList.length != 0 &&
        filteredStaffList.map((e, index) => (
          <AStaff
            staff={e}
            key={index + 1}
            index={index}
            sortedField={sortedField}
            direction={direction}
            listSize={filteredStaffList.length}
            selectedEntity={selectedEntity}
            showInList={showInList}
            onEditButtonClick={handleEditButtonClick}
            onDeleteButtonClick={handleDeleteButtonClick}
          />
        ))}
    </>
  );
}
