import { useEffect, useState } from "react";
import SideBar from "./SideBar";
import ContentPage from "./ContentPage";
import HomePage from "./HomePage";
import LoginSignupPage from "./LoginSignupPage";
import axios from "axios";

export default function RestaurantHomePage() {
  let [loadFlag, setLoadFlag] = useState(false);
  let [selectedEntity, setSelectedEntity] = useState("");
  let [flagToggleButton, setFlagToggleButton] = useState(false);
  let [user, setUser] = useState("");
  let [view, setView] = useState("home");
  let menus = [
    {
      name: "Manage",
      accessLevel: "D",
      entities: [
        {
          name: "Products",
          singularName: "Product",
          dbCollection: "products",
          addFacility: true,
          accessLevel: "D",
        },
        {
          name: "Customers",
          singularName: "Customer",
          dbCollection: "customers",
          addFacility: true,
          accessLevel: "D",
        },
        {
          name: "Product Categories",
          singularName: "Category",
          dbCollection: "categories",
          addFacility: true,
          accessLevel: "A",
        },
      ],
    },
    {
      name: "Settings",
      accessLevel: "A",
      entities: [
        {
          name: "Users",
          singularName: "User",
          dbCollection: "users",
          addFacility: true,
          accessLevel: "A",
        },
        {
          name: "Roles",
          singularName: "Role",
          dbCollection: "roles",
          addFacility: true,
          accessLevel: "A",
        },
      ],
    },
    {
      accessLevel: "D",
      name: "Reports",
      entities: [
        {
          name: "Activities",
          singularName: "Activity",
          dbCollection: "activities",
          addFacility: false,
          accessLevel: "A",
        },
      ],
    },
  ];
  useEffect(() => {
    setSession();
  }, []);
  async function setSession() {
    let response = await axios.get("http://localhost:3000/specials/welcome");
    if (response.data.role != "new" && response.data.role != "guest") {
      // user is alreay logged in and has refreshed the page
      setUser(response.data);
    }
  }
  function handleEntityClick(selectedMenuIndex, selectedIndex) {
    setLoadFlag(true);
    setSelectedEntity(menus[selectedMenuIndex].entities[selectedIndex]);
    setView("content");
    setLoadFlag(false);
  }
  function handleSideBarMenuClick() {
    setSelectedEntity("");
    setView("home");
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
  function handleLogInSignupButtonClick() {
    setView("loginSignup");
  }
  async function setLoggedinUser(loggedinUser) {
    console.log(loggedinUser);
    setView("home");
    // get access level of this user
    let response = await axios.get(
      "http://localhost:3000/roles/" + loggedinUser.roleId
    );
    loggedinUser.level = response.data.level;
    setUser(loggedinUser);
  }
  function handleSignoutClick() {
    setUser("");
    setView("home");
    // remove jwt token from backend
    let response = axios.post("http://localhost:3000/users/signout");
  }
  return (
    <div className="row justify-content-center p-4">
      {true && (
        <div className="col-2 ">
          <SideBar
            // entities={entities}
            user={user}
            menus={menus}
            flagToggleButton={flagToggleButton}
            onEntityClick={handleEntityClick}
            onSideBarMenuClick={handleSideBarMenuClick}
            onToggleSidebar={handleToggleSidebar}
            onLogInSignupButtonClick={handleLogInSignupButtonClick}
            onSignoutClick={handleSignoutClick}
          />
        </div>
      )}
      {/* <div className="col-10 ">
        <NavBar />
      </div> */}
      {view == "home" && <HomePage user={user} />}
      {!user && view == "loginSignup" && (
        <LoginSignupPage setLoggedinUser={setLoggedinUser} />
      )}
      {view == "content" && (
        <div className={flagToggleButton ? "col-9" : "col-12"}>
          <ContentPage selectedEntity={selectedEntity} />
        </div>
      )}
      {/* <div className="col-10 ">{true && <Content />}</div> */}
    </div>
  );
}
