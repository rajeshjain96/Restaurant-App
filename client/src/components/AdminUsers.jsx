import { useEffect, useState } from "react";
import CommonUtilityBar from "./CommonUtilityBar";
import AdminUserForm from "./AdminUserForm";
import { BeatLoader } from "react-spinners";
import AUser from "./AUser";
import axios from "axios";

export default function AdminUsers(props) {
  let [userList, setUserList] = useState([]);
  let [roleList, setRoleList] = useState([]);
  let [action, setAction] = useState("list");
  let [filteredUserList, setFilteredUserList] = useState([]);
  let [userToBeEdited, setUserToBeEdited] = useState("");
  let [flagLoad, setFlagLoad] = useState(false);
  let [message, setMessage] = useState("");
  let [searchText, setSearchText] = useState("");
  let [sortedField, setSortedField] = useState("");
  let [direction, setDirection] = useState("");
  let { selectedEntity } = props;
  let { flagFormInvalid } = props;
  let { flagToggleButton } = props;

  let userSchema = [
    { attribute: "name" },
    {
      attribute: "role",
      relationalData: true,
      list: "roleList",
      relatedId: "roleId",
    },
    { attribute: "roleId", type: "relationalId" },
    { attribute: "status", defaultValue: "active" },
    { attribute: "emailId" },
    // { attribute: "password" },
    { attribute: "mobileNumber" },
    // { attribute: "address" },
  ];
  let userValidations = {
    name: { message: "", mxLen: 80, mnLen: 4, onlyDigits: false },
    emailId: { message: "", onlyDigits: false },
    status: { message: "" },
    mobileNumber: {
      message: "",
      mxLen: 10,
      mnLen: 10,
      onlyDigits: true,
    },
    // address: { message: "" },
    // password: { message: "" },
    role: { message: "" },
  };
  let [showInList, setShowInList] = useState(getShowInListFromUserSchema());
  let [emptyUser, setEmptyUser] = useState(getEmptyUser());
  function getShowInListFromUserSchema() {
    let list = [];
    let cnt = 0;
    userSchema.forEach((e, index) => {
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
  function getEmptyUser() {
    let eUser = {};
    userSchema.forEach((e, index) => {
      if (e["defaultValue"]) {
        eUser[e["attribute"]] = e["defaultValue"];
      } else {
        eUser[e["attribute"]] = "";
      }
    });
    return eUser;
  }
  function getFileListFromUserSchema() {
    let list = [];
    userSchema.forEach((e, index) => {
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
    setFlagLoad(true);
    try {
      let response = await axios(import.meta.env.VITE_API_URL + "/users");
      let pList = await response.data;
      response = await axios(import.meta.env.VITE_API_URL + "/roles");
      let rList = await response.data;
      // In the userList, add a parameter - role
      pList.forEach((user, index) => {
        // get role (string) from roleId
        for (let i = 0; i < rList.length; i++) {
          if (user.roleId == rList[i]._id) {
            user.role = rList[i].name;
            break;
          }
        } //for
      });
      setUserList(pList);
      setFilteredUserList(pList);
      setRoleList(rList);
    } catch (error) {
      showMessage("Something went wrong, refresh the page");
    }
    setFlagLoad(false);
  }
  async function handleFormSubmit(user) {
    let message;
    // now remove relational data
    let userForBackEnd = { ...user };
    for (let key in userForBackEnd) {
      userSchema.forEach((e, index) => {
        if (key == e.attribute && e.relationalData) {
          delete userForBackEnd[key];
        }
      });
    }
    if (action == "add") {
      // user = await addUserToBackend(user);
      setFlagLoad(true);
      try {
        let response = await axios.post(
          import.meta.env.VITE_API_URL + "/users",
          userForBackEnd,
          { headers: { "Content-type": "multipart/form-data" } }
        );
        user._id = await response.data.insertedId;
        message = "User added successfully";
        // update the user list now.
        let prList = [...userList];
        prList.push(user);
        setUserList(prList);

        let fprList = [...filteredUserList];
        fprList.push(user);
        setFilteredUserList(fprList);
        showMessage(message);
        setAction("list");
      } catch (error) {
        showMessage("Something went wrong, refresh the page");
      }
      setFlagLoad(false);
    } else if (action == "update") {
      user._id = userToBeEdited._id; // The form does not have id field
      setFlagLoad(true);
      try {
        let response = await axios.put(
          import.meta.env.VITE_API_URL + "/users",
          user,
          {
            headers: { "Content-type": "multipart/form-data" },
          }
        );
        let r = await response.data;
        message = "User Updated successfully";
        // update the user list now.
        let prList = userList.map((e, index) => {
          if (e._id == user._id) return user;
          return e;
        });
        let fprList = filteredUserList.map((e, index) => {
          if (e._id == user._id) return user;
          return e;
        });
        setUserList(prList);
        setFilteredUserList(fprList);
        showMessage(message);
        setAction("list");
      } catch (error) {
        showMessage("Something went wrong, refresh the page");
      }
      setFlagLoad(false);
    }
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
  function handleEditButtonClick(user) {
    setAction("update");
    setUserToBeEdited(user);
  }
  function showMessage(message) {
    setMessage(message);
    window.setTimeout(() => {
      setMessage("");
    }, 3000);
  }
  async function handleDeleteButtonClick(ans, user) {
    // await deleteBackendUser(user.id);
    setFlagLoad(true);
    try {
      let response = await axios.delete(
        import.meta.env.VITE_API_URL + "/users/" + user._id
      );
      let r = await response.data;
      message = `User - ${user.name} deleted successfully.`;
      //update the user list now.
      let prList = userList.filter((e, index) => e._id != user._id);
      setUserList(prList);

      let fprList = userList.filter((e, index) => e._id != user._id);
      setFilteredUserList(fprList);
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
    let list = [...filteredUserList];
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
    setFilteredUserList(list);
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

    let list = [...filteredUserList];
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
    setFilteredUserList(list);
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
      setFilteredUserList(userList);
      return;
    }
    let searchedUsers = [];
    // searchedUsers = filterByName(query);
    searchedUsers = filterByShowInListAttributes(query);
    setFilteredUserList(searchedUsers);
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
    for (let i = 0; i < userList.length; i++) {
      for (let j = 0; j < showInList.length; j++) {
        if (showInList[j].show) {
          let parameterName = showInList[j].attribute;
          if (
            userList[i][parameterName] &&
            userList[i][parameterName]
              .toLowerCase()
              .includes(query.toLowerCase())
          ) {
            fList.push(userList[i]);
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
        filteredList={filteredUserList}
        showInList={showInList}
        onListClick={handleListClick}
        onAddEntityClick={handleAddEntityClick}
        onSearchKeyUp={handleSearchKeyUp}
      />
      {filteredUserList.length == 0 && userList.length != 0 && (
        <div className="text-center">Nothing to show</div>
      )}
      {userList.length == 0 && <div className="text-center">List is empty</div>}
      {(action == "add" || action == "update") && (
        <div className="row">
          <AdminUserForm
            userSchema={userSchema}
            userValidations={userValidations}
            emptyUser={emptyUser}
            roleList={roleList}
            selectedEntity={selectedEntity}
            userToBeEdited={userToBeEdited}
            action={action}
            flagFormInvalid={flagFormInvalid}
            onFormSubmit={handleFormSubmit}
            onFormCloseClick={handleFormCloseClick}
            onFormTextChangeValidations={handleFormTextChangeValidations}
          />
        </div>
      )}
      {action == "list" && filteredUserList.length != 0 && (
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
      {action == "list" && filteredUserList.length != 0 && (
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
        filteredUserList.length != 0 &&
        filteredUserList.map((e, index) => (
          <AUser
            user={e}
            key={index + 1}
            index={index}
            sortedField={sortedField}
            direction={direction}
            listSize={filteredUserList.length}
            selectedEntity={selectedEntity}
            showInList={showInList}
            onEditButtonClick={handleEditButtonClick}
            onDeleteButtonClick={handleDeleteButtonClick}
          />
        ))}
    </>
  );
}
