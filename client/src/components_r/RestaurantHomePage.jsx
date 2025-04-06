import { useState } from "react";
import Content from "./Content";
import SideBar from "./SideBar";
import AdminProducts from "./AdminProducts";

export default function RestaurantHomePage() {
  let [loadFlag, setLoadFlag] = useState(false);
  let [selectedEntity, setSelectedEntity] = useState("");
  let entities = [
    { name: "Products", singularName: "Product", dbCollection: "products" },
    { name: "Categories", singularName: "Product", dbCollection: "categories" },
    { name: "Users", singularName: "Product", dbCollection: "users" },
    { name: "Tables", singularName: "Product", dbCollection: "tables" },
    { name: "Bills", singularName: "Product", dbCollection: "bills" },
  ];
  function handleEntityClick(selectedIndex) {
    setLoadFlag(true);
    // setSortedField("");
    // let sEntity = .name;
    // getListFromBackEnd(entities[selectedIndex].dbCollection);
    setSelectedEntity(entities[selectedIndex]);
    // if (sEntity.requiredLists.length != 0) {
    //   // data is to be fetched
    //   getRequiredLists(sEntity);
    // } else {
    //   setSelectedEntity(sEntity);
    // }
    // let emptyObj = {};
    // let emptyVArray = [];
    // sEntity.attributes.forEach((e, index) => {
    //   emptyObj[e.id] = e.value;
    //   emptyVArray.push(e.validations);
    // });
    //This is empty object for ADD form
    // setEmptyEntityObject(emptyObj);
    // setEmptyValidationsArray(emptyVArray);
    // setAction("list");
    // setSelectedEntityIndex(selectedIndex);
    // setSelectedEntityName(entities[selectedIndex].dbCollection);
    setLoadFlag(false);
  }
  async function getListFromBackEnd(collectionName) {
    // let response = await axios("http://localhost:3000/" + collectionName);
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
  return (
    <div className="row">
      <div className="col-2 ">
        <SideBar entities={entities} onEntityClick={handleEntityClick} />
      </div>
      <div className="col-10 ">
        {selectedEntity.name == "Products" && (
          <AdminProducts selectedEntity={selectedEntity} />
        )}
      </div>
      {/* <div className="col-10 ">{true && <Content />}</div> */}
    </div>
  );
}
