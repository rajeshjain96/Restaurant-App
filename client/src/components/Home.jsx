import { useEffect, useState } from "react";
import Content from "./Content";
import SideBar from "./SideBar";
import { entities } from "./Entities.js";
import axios from "axios";
export default function Home() {
  let [loadFlag, setLoadFlag] = useState(false);
  let [selectedEntity, setSelectedEntity] = useState("");
  let [selectedEntityName, setSelectedEntityName] = useState("");
  let [formData, setFormData] = useState("");
  let [emptyEntityObject, setEmptyEntityObject] = useState("");
  let [emptyValidationsArray, setEmptyValidationsArray] = useState("");
  let [requiredLists, setRequiredLists] = useState("");
  let [selectedEntityIndex, setSelectedEntityIndex] = useState(-1);
  let [action, setAction] = useState("add");
  let [message, setMessage] = useState("");
  let [itemToBeEdited, setItemToBeEdited] = useState("");
  let [categoryList, setCategoryList] = useState([]);
  let [productList, setProductList] = useState([]);
  let [selectedList, setSelectedList] = useState([]);
  let [filteredList, setFilteredList] = useState([]);
  let [sortedField, setSortedField] = useState("");
  let [direction, setDirection] = useState("");
  let [searchText, setSearchText] = useState("");
  let [flagFormInvalid, setFlagFormInvalid] = useState(false);
  let entityDisplayNames = entities.map((e, index) => e.displayName);

  // useEffect(()=>{
  //   if(selectedEntityIndex!=-1)
  //   {
  //     handleEntityClick(selectedEntityIndex);
  //   }
  // },[selectedEntityIndex]);
  function handleEntityClick(selectedIndex) {
    setLoadFlag(true);
    setSortedField("");

    let sEntity = entities[selectedIndex];
    getListFromBackEnd(entities[selectedIndex].dbCollection);
    // if (entities[selectedIndex].dbCollection == "categories") {
    //   getCategoriesFromBackEnd();
    // } else if (entities[selectedIndex].dbCollection == "products") {
    //   getProductsFromBackEnd();
    // }
    getRequiredLists(sEntity);
    // if (sEntity.requiredLists.length != 0) {
    //   // data is to be fetched
    //   getRequiredLists(sEntity);
    // } else {
    //   setSelectedEntity(sEntity);
    // }
    let emptyObj = {};
    let emptyVArray = [];
    sEntity.attributes.forEach((e, index) => {
      emptyObj[e.id] = e.value;
      emptyVArray.push(e.validations);
    });
    //This is empty object for ADD form
    setEmptyEntityObject(emptyObj);
    setEmptyValidationsArray(emptyVArray);
    setAction("list");
    setSelectedEntityIndex(selectedIndex);
    setSelectedEntityName(entities[selectedIndex].dbCollection);
    setLoadFlag(false);
  }
  async function getRequiredLists(sEntity) {
    let rList = {};

    for (let i = 0; i < sEntity.requiredLists.length; i++) {
      let response = await axios(
        "http://localhost:3000/" + sEntity.requiredLists[i].dbRoute
      );
      let list = response.data;
      let listName = `${sEntity.requiredLists[i].listName}`;
      rList[listName] = list;
    } //for
    // search for the fields whose type is dropdown.
    let att = [...sEntity.attributes];
    let a = att.map((e, index) => {
      let p = { ...e };
      if (index < 4) {
        p.showInList = true;
      } else {
        p.showInList = false;
      }
      if (p.type == "dropdown") {
        let options = rList[`${p.options}`].map((ele, i) => ele);
        p.optionList = options;
        return p;
      }
      return p;
    });
    sEntity.attributes = a;
    console.log(sEntity);
    setSelectedEntity({ ...sEntity, attributes: a });
    setRequiredLists(rList);
  }
  async function getListFromBackEnd(collectionName) {
    let response = await axios("http://localhost:3000/" + collectionName);
    let list = response.data;
    // sort the list by date of update
    list.sort(function (a, b) {
      var c = new Date(a.updateDate);
      var d = new Date(b.updateDate);
      return d - c;
      // return b.updateDate - a.updateDate;
    });
    setSelectedList(list);
    setFilteredList(list);
  }

  function handleAddEntityClick() {
    setAction("add");
  }
  function handleSubmit(obj) {
    // check for form validations
    let flag = false;
    emptyValidationsArray.forEach((e, index) => {
      if (e.message) {
        flag = true;
      }
    });
    if (flag) {
      setFlagFormInvalid(true);
      return;
    }
    setFlagFormInvalid(false);
    if (action == "add") {
      handleAddSubmitForm(obj);
    } else if (action == "edit") {
      handleEditSubmitForm(obj);
    }
  }
  async function handleAddSubmitForm(obj) {
    // if files are there, add them also
    let cnt = 0;

    selectedEntity.attributes.map((e, index) => {
      if (e.type == "file") {
        cnt++;
        obj[e.id + "_file"] = e.file;
      }
    });
    let response = await axios.post(
      "http://localhost:3000/" + selectedEntity.dbCollection,
      obj,
      { headers: { "Content-type": "multipart/form-data" } }
    );
    // id is reurned back
    obj._id = response.data.insertedId;
    //update the list
    let list = [...selectedList];
    let fList = [...filteredList];
    list.unshift(obj);
    fList.unshift(obj);
    // list.push(obj);
    // fList.push(obj);
    // setCategoryList(cList);
    setSelectedList(list);
    setFilteredList(fList);

    // if (selectedEntityName == "categories") {
    //   let response = await axios.post("http://localhost:3000/categories", obj);
    //   obj = response.data;
    //   //update the list
    //   let cList = [...categoryList];
    //   cList.push(obj);
    //   setCategoryList(cList);
    //   setSelectedList(cList);
    // } else if (selectedEntityName == "products") {
    //   let response = await axios.post("http://localhost:3000/products", obj);
    //   obj = response.data;
    //   //update the list
    //   let pList = [...productList];
    //   pList.push(obj);
    //   setProductList(pList);
    //   setSelectedList(pList);
    // }
    showMessage(selectedEntity.btnLabel + " added successfully");
    setAction("list");
  }
  async function handleEditSubmitForm(obj) {
    let response = await axios.put(
      "http://localhost:3000/" + selectedEntity.dbCollection,
      obj
    );
    let obj1 = response.data;
    //update the list
    let list = selectedList.map((e, index) => {
      if (e._id == obj._id) {
        return obj;
      }
      return e;
    });
    let fList = filteredList.map((e, index) => {
      if (e._id == obj._id) {
        return obj;
      }
      return e;
    });
    setSelectedList(list);
    setFilteredList(fList);
    // if (selectedEntityName == "categories") {
    //   let response = await axios.put("http://localhost:3000/categories", obj);
    //   let obj1 = response.data;
    //   //update the list
    //   let cList = categoryList.map((e, index) => {
    //     if (e._id == obj._id) {
    //       return obj;
    //     }
    //     return e;
    //   });
    //   setCategoryList(cList);
    //   setSelectedList(cList);
    // } else if (selectedEntityName == "products") {
    //   let response = await axios.put("http://localhost:3000/products", obj);
    //   obj = response.data;
    //   //update the list
    //   let pList = productList.map((e, index) => {
    //     if (e._id == obj._id) {
    //       return obj;
    //     }
    //     return e;
    //   });
    //   setProductList(pList);
    //   setSelectedList(pList);
    // }
    showMessage(selectedEntity.btnLabel + " updated successfully");
    setAction("list");
  }
  function handleFormCloseClick() {
    // setSelectedEntityIndex(-1);
  }
  function handleListClick() {
    setAction("list");
  }
  function handleEditButtonClick(item) {
    setAction("edit");
    setItemToBeEdited(item);
  }
  async function handleDeleteButtonClick(ans, item) {
    if (ans == "No") {
      showMessage("Delete operation cancelled");
      return;
    }
    let response = await axios.delete(
      "http://localhost:3000/" + selectedEntityName + "/" + item._id
    );
    let obj1 = response.data;
    //update the list
    let list = selectedList.filter((e, index) => e._id != item._id);
    let fList = filteredList.filter((e, index) => e._id != item._id);
    setSelectedList(list);
    setFilteredList(fList);
    showMessage("Data of " + item.name + " deleted successfullly");
  }
  function handleListCheckBoxClick(checked, selectedIndex) {
    // Minimum 1 field should be shown
    let cnt = 0;
    selectedEntity.attributes.forEach((e, index) => {
      if (e.showInList) {
        cnt++;
      }
    });
    if (cnt == 1 && !checked) {
      showMessage("Minimum 1 field should be selected.");

      return;
    }
    let sEntity = { ...selectedEntity };
    let att = [...sEntity.attributes];
    let a = att.map((e, index) => {
      let p = { ...e };
      if (index == selectedIndex && checked) {
        p.showInList = true;
      } else if (index == selectedIndex && !checked) {
        p.showInList = false;
      }
      return p;
    });
    sEntity.attributes = a;
    setSelectedEntity(sEntity);
  }
  function handleFormTextChangeValidations(message, selectedIndex) {
    // we have to set the error message, if any for the particular field (index is available)
    let a = emptyValidationsArray.map((e, index) => {
      if (index == selectedIndex) {
        let obj = { ...e };
        obj.message = message;
        return obj;
      } else {
        return e;
      }
    });
    setEmptyValidationsArray(a);
  }
  function handleFileUploadChange(file, selectedIndex) {
    let sEntity = { ...selectedEntity };
    let att = [...sEntity.attributes];
    let a = att.map((e, index) => {
      let p = { ...e };
      if (index == selectedIndex) {
        p.preview = URL.createObjectURL(file);
        p.size = file.size;
        p.file = file;
      }
      return p;
    });
    sEntity.attributes = a;
    setSelectedEntity(sEntity);
  }
  function handleSrNoClick() {
    // let field = selectedEntity.attributes[index].id;
    let d = false;
    if (sortedField === "updateDate") {
      d = !direction;
    } else {
      d = false;
    }

    let list = [...filteredList];
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
    setFilteredList(list);
    setSortedField("updateDate");
  }
  function handleHeaderClick(index) {
    let field = selectedEntity.attributes[index].id;
    let d = false;
    if (field === sortedField) {
      // same button clicked twice
      d = !direction;
    } else {
      // different field
      d = false;
    }
    let list = [...filteredList];
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
    // setSelectedList(list);
    setFilteredList(list);
    setSortedField(field);
  }
  function showMessage(m) {
    setMessage(m);
    window.setTimeout(() => {
      setMessage("");
    }, 3000);
  }
  function handleSearchKeyUp(event) {
    let searchText = event.target.value;
    setSearchText(searchText);
    performSearchOperation(searchText);
  }
  function performSearchOperation(searchText) {
    let query = searchText.trim();
    if (query.length == 0) {
      setFilteredList(selectedList);
      return;
    }
    let searchedProducts = [];
    // searchedProducts = filterByName(query);
    searchedProducts = filterByShowInListParameters(query);
    setFilteredList(searchedProducts);
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
  function filterByShowInListParameters(query) {
    let fList = [];
    // console.log(selectedEntity.attributes[0].showInList);

    for (let i = 0; i < selectedList.length; i++) {
      for (let j = 0; j < selectedEntity.attributes.length; j++) {
        if (selectedEntity.attributes[j].showInList) {
          let parameterName = selectedEntity.attributes[j].id;
          if (
            selectedList[i][parameterName]
              .toLowerCase()
              .includes(query.toLowerCase())
          ) {
            fList.push(selectedList[i]);
            break;
          }
        }
      } //inner for
    } //outer for
    return fList;
  }
  if (loadFlag) {
    return <div>Wait...</div>;
  }
  return (
    <div className="row  justify-content-between">
      <div className="col-2 ">
        <SideBar
          entityDisplayNames={entityDisplayNames}
          onEntityClick={handleEntityClick}
        />
      </div>
      <div className="col-10 ">
        {selectedEntity && (
          <Content
            message={message}
            action={action}
            selectedList={selectedList}
            filteredList={filteredList}
            selectedEntity={selectedEntity}
            selectedEntityIndex={selectedEntityIndex}
            formData={formData}
            emptyEntityObject={emptyEntityObject}
            emptyValidationsArray={emptyValidationsArray}
            itemToBeEdited={itemToBeEdited}
            requiredLists={requiredLists}
            sortedField={sortedField}
            direction={direction}
            flagFormInvalid={flagFormInvalid}
            onListClick={handleListClick}
            onSubmit={handleSubmit}
            onFormCloseClick={handleFormCloseClick}
            onAddEntityClick={handleAddEntityClick}
            onEditButtonClick={handleEditButtonClick}
            onDeleteButtonClick={handleDeleteButtonClick}
            onListCheckBoxClick={handleListCheckBoxClick}
            onHeaderClick={handleHeaderClick}
            onSearchKeyUp={handleSearchKeyUp}
            onSrNoClick={handleSrNoClick}
            onFormTextChangeValidations={handleFormTextChangeValidations}
            onFileUploadChange={handleFileUploadChange}
          />
        )}
      </div>
    </div>
  );
}
