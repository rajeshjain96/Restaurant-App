import { useState } from "react";
import SideBar from "./SideBar";
import AdminProducts from "./AdminProducts";
import AdminCategories from "./AdminCategories";
import AdminStaff from "./AdminStaff";
import AdminCustomers from "./AdminCustomers";
import ContentPage from "./ContentPage";
import HomePage from "./HomePage";
import NavBar from "./NavBar";

export default function RestaurantHomePage() {
  let [loadFlag, setLoadFlag] = useState(false);
  let [selectedEntity, setSelectedEntity] = useState("");
  let [flagToggleButton, setFlagToggleButton] = useState(false);
  let [user, setUser] = useState(true);
  let menus = [
    {
      name: "Manage",
      entities: [
        {
          name: "Products",
          singularName: "Product",
          dbCollection: "products",
          addFacility: true,
        },
        {
          name: "Customers",
          singularName: "Customer",
          dbCollection: "customers",
          addFacility: true,
        },
        {
          name: "Product Categories",
          singularName: "Category",
          dbCollection: "categories",
          addFacility: true,
        },
        {
          name: "Users",
          singularName: "User",
          dbCollection: "users",
          addFacility: true,
        },
      ],
    },
    {
      name: "Control",
      entities: [
        {
          name: "Products",
          singularName: "Product",
          dbCollection: "products",
          addFacility: true,
        },
        {
          name: "Customers",
          singularName: "Customer",
          dbCollection: "customers",
          addFacility: true,
        },
      ],
    },
    {
      name: "Reports",
      entities: [
        {
          name: "Products",
          singularName: "Product",
          dbCollection: "products",
          addFacility: true,
        },
        {
          name: "Customers",
          singularName: "Customer",
          dbCollection: "customers",
          addFacility: true,
        },
      ],
    },
  ];
  function handleEntityClick(selectedMenuIndex, selectedIndex) {
    setLoadFlag(true);
    setSelectedEntity(menus[selectedMenuIndex].entities[selectedIndex]);
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
  function handleToggleSidebar() {
    console.log(flagToggleButton);
    let flag = flagToggleButton;
    flag = !flag;
    setFlagToggleButton(flag);
  }
  return (
    <div className="row justify-content-center p-4">
      {true && (
        <div className="col-2 ">
          <SideBar
            // entities={entities}
            menus={menus}
            flagToggleButton={flagToggleButton}
            onEntityClick={handleEntityClick}
            onToggleSidebar={handleToggleSidebar}
          />
        </div>
      )}
      <div className="col-10 ">
        <NavBar />
      </div>
      {!user && <HomePage />}
      <div className={flagToggleButton ? "col-9" : "col-12"}>
        <ContentPage selectedEntity={selectedEntity} />
      </div>

      {/* <div className="col-10 ">{true && <Content />}</div> */}
    </div>
  );
}
