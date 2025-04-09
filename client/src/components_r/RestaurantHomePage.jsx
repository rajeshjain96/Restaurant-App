import { useState } from "react";
import SideBar from "./SideBar";
import AdminProducts from "./AdminProducts";
import AdminCategories from "./AdminCategories";
import AdminStaff from "./AdminStaff";

export default function RestaurantHomePage() {
  let [loadFlag, setLoadFlag] = useState(false);
  let [selectedEntity, setSelectedEntity] = useState("");
  let entities = [
    {
      name: "Products",
      singularName: "Product",
      dbCollection: "products",
      addFacility: true,
    },
    {
      name: "Categories",
      singularName: "Category",
      dbCollection: "categories",
      addFacility: true,
    },
    {
      name: "Staff",
      singularName: "Staff",
      dbCollection: "staff",
      addFacility: true,
    },
    {
      name: "Bills",
      singularName: "Bill",
      dbCollection: "bills",
      addFacility: false,
    },
  ];
  function handleEntityClick(selectedIndex) {
    setLoadFlag(true);
    setSelectedEntity(entities[selectedIndex]);
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
      {selectedEntity.name == "Products" && (
        <div className="col-10 ">
          <AdminProducts selectedEntity={selectedEntity} />
        </div>
      )}
      {selectedEntity.name == "Categories" && (
        <div className="col-10 ">
          <AdminCategories selectedEntity={selectedEntity} />
        </div>
      )}
      {selectedEntity.name == "Staff" && (
        <div className="col-10 ">
          <AdminStaff selectedEntity={selectedEntity} />
        </div>
      )}
      {/* <div className="col-10 ">{true && <Content />}</div> */}
    </div>
  );
}
