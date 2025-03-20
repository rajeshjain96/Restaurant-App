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
  let [requiredLists, setRequiredLists] = useState("");
  let [selectedEntityIndex, setSelectedEntityIndex] = useState(-1);
  let [action, setAction] = useState("add");
  let [message, setMessage] = useState("");
  let [itemToBeEdited, setItemToBeEdited] = useState("");
  let [categoryList, setCategoryList] = useState([]);
  let [productList, setProductList] = useState([]);
  let [selectedList, setSelectedList] = useState([]);
  let entityDisplayNames = entities.map((e, index) => e.displayName);
  // useEffect(()=>{
  //   if(selectedEntityIndex!=-1)
  //   {
  //     handleEntityClick(selectedEntityIndex);
  //   }
  // },[selectedEntityIndex]);
  function handleEntityClick(selectedIndex) {
    setLoadFlag(true);

    let sEntity = entities[selectedIndex];
    if (entities[selectedIndex].dbCollection == "categories") {
      getCategoriesFromBackEnd();
    } else if (entities[selectedIndex].dbCollection == "products") {
      getProductsFromBackEnd();
    }
    getRequiredLists(sEntity);
    // if (sEntity.requiredLists.length != 0) {
    //   // data is to be fetched
    //   getRequiredLists(sEntity);
    // } else {
    //   setSelectedEntity(sEntity);
    // }
    let fd = sEntity.attributes.map((e, index) => {
      let obj = {};
      obj[e.id] = e.value;
      return obj;
    });
    setFormData(fd);
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
    // let sEntity = { ...selectedEntity };
    let att = [...sEntity.attributes];
    // console.log(att[3].options);
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
    // console.log(att[3].options);
    sEntity.attributes = a;
    console.log(sEntity);
    // console.log();
    setSelectedEntity({ ...sEntity, attributes: a });
    setRequiredLists(rList);
  }
  // setSelectedEntity(entities[selectedIndex]);
  // setSelectedEntityIndex(selectedIndex);
  // }
  async function getCategoriesFromBackEnd() {
    // setLoadFlag(true);
    let response = await axios("http://localhost:3000/categories");
    let list = response.data;
    setCategoryList(list);
    // setSelectedList(list);
    setSelectedList(list);
    // setLoadFlag(false);
  }
  async function getProductsFromBackEnd() {
    // setLoadFlag(true);
    let response = await axios("http://localhost:3000/products");
    let list = response.data;
    setProductList(list);
    setSelectedList(list);
    // setLoadFlag(false);
  }
  function handleAddEntityClick() {
    setAction("add");
  }
  function handleSubmit(obj) {
    if (action == "add") {
      handleAddSubmitForm(obj);
    } else if (action == "edit") {
      handleEditSubmitForm(obj);
    }
  }
  async function handleAddSubmitForm(obj) {
    if (selectedEntityName == "categories") {
      let response = await axios.post("http://localhost:3000/categories", obj);
      obj = response.data;
      //update the list
      let cList = [...categoryList];
      cList.push(obj);
      setCategoryList(cList);
      setSelectedList(cList);
    } else if (selectedEntityName == "products") {
      let response = await axios.post("http://localhost:3000/products", obj);
      obj = response.data;
      //update the list
      let pList = [...productList];
      pList.push(obj);
      setProductList(pList);
      setSelectedList(pList);
    }
    setMessage(selectedEntity.btnLabel + " added successfully");
    window.setTimeout(() => {
      setMessage("");
    }, 3000);
  }
  async function handleEditSubmitForm(obj) {
    if (selectedEntityName == "categories") {
      let response = await axios.put("http://localhost:3000/categories", obj);
      let obj1 = response.data;
      //update the list
      let cList = categoryList.map((e, index) => {
        if (e._id == obj._id) {
          return obj;
        }
        return e;
      });
      setCategoryList(cList);
      setSelectedList(cList);
    } else if (selectedEntityName == "products") {
      let response = await axios.put("http://localhost:3000/products", obj);
      obj = response.data;
      //update the list
      let pList = productList.map((e, index) => {
        if (e._id == obj._id) {
          return obj;
        }
        return e;
      });
      setProductList(pList);
      setSelectedList(pList);
    }
    setMessage(selectedEntity.btnLabel + " updated successfully");
    setAction("list");
    window.setTimeout(() => {
      setMessage("");
    }, 3000);
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
  async function handleDeleteButtonClick(item) {
    let response = await axios.delete(
      "http://localhost:3000/" + selectedEntityName + "/" + item._id
    );
    let obj1 = response.data;
    //update the list
    let list = selectedList.filter((e, index) => e._id != item._id);
    setSelectedList(list);
  }
  function handleListCheckBoxClick(checked, selectedIndex) {
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
    // setRequiredLists(rList);
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
            categoryList={categoryList}
            productList={productList}
            selectedList={selectedList}
            onListClick={handleListClick}
            onSubmit={handleSubmit}
            onFormCloseClick={handleFormCloseClick}
            onAddEntityClick={handleAddEntityClick}
            onEditButtonClick={handleEditButtonClick}
            onDeleteButtonClick={handleDeleteButtonClick}
            onListCheckBoxClick={handleListCheckBoxClick}
            selectedEntity={selectedEntity}
            selectedEntityIndex={selectedEntityIndex}
            formData={formData}
            itemToBeEdited={itemToBeEdited}
            requiredLists={requiredLists}
          />
        )}
      </div>
    </div>
  );
}
