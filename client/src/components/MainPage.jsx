import { useEffect, useState } from "react";
import ContentPage from "./ContentPage";
import HomePage from "./HomePage";
import LoginSignupPage from "./LoginSignupPage";
import axios from "axios";
import { BeatLoader } from "react-spinners";
import MenuBar from "./MenuBar";
export default function MainPage() {
  let [selectedEntity, setSelectedEntity] = useState("");
  let [user, setUser] = useState("");
  let [view, setView] = useState("loginSignup");
  let [flagLoad, setFlagLoad] = useState(false);
  let [message, setMessage] = useState("");
  let [selectedMenuIndex, setSelectedMenuIndex] = useState(-1);
  let [selectedEntityIndex, setSelectedEntityIndex] = useState(-1);
  let menus = [
    {
      name: "Manage",
      accessLevel: "D",
      entities: [
        {
          name: "Products",
          singularName: "Product",
          addFacility: true,
          deleteFacility: true,
          editFacility: true,
          isReady: true,
          accessLevel: "D",
        },
        {
          name: "Enquiries",
          singularName: "Enquiry",
          addFacility: true,
          deleteFacility: true,
          editFacility: true,
          isReady: true,
          accessLevel: "D",
        },
        {
          name: "Product Categories",
          singularName: "Category",
          addFacility: true,
          deleteFacility: false,
          editFacility: false,
          isReady: true,
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
          deleteFacility: true,
          editFacility: true,
          accessLevel: "A",
        },
        {
          name: "Roles",
          singularName: "Role",
          dbCollection: "roles",
          addFacility: true,
          deleteFacility: true,
          editFacility: true,
          accessLevel: "A",
        },
      ],
    },
    {
      accessLevel: "D",
      name: "Reports",
      entities: [
        {
          name: "Activity Report",
          singularName: "Activity",
          dbCollection: "activities",
          addFacility: false,
          deleteFacility: true,
          editFacility: true,
          accessLevel: "A",
        },
      ],
    },
  ];
  useEffect(() => {}, []);
  function handleEntityClick(selectedIndex) {
    // user clicked to same entity again, so unselect it
    // if (
    //   selectedEntity.name ==
    //   menus[selectedMenuIndex].entities[selectedIndex].name
    // ) {
    //   setSelectedMenuIndex(-1);
    //   setSelectedEntityIndex(-1);
    //   return;
    // }
    setSelectedEntityIndex(selectedIndex);
    setSelectedEntity(menus[selectedMenuIndex].entities[selectedIndex]);
    setView("content");
  }
  function handleSideBarMenuClick(index) {
    if (selectedMenuIndex == index) {
      setSelectedMenuIndex(-1);
    } else {
      setSelectedMenuIndex(index);
    }
    setSelectedEntityIndex(-1);
    setSelectedEntity("");
  }
  function handleToggleSidebar() {}
  function handleLogInSignupButtonClick() {
    setView("loginSignup");
  }
  async function setLoggedinUser(loggedinUser) {
    setView("menuBar");
    // get access level of this user
    // let response = await axios.get(
    //   "http://localhost:3000/roles/" + loggedinUser.roleId
    // );
    // loggedinUser.level = response.data.level;
    setUser(loggedinUser);
  }
  function handleLogoutClick() {
    setUser("");
    setView("loginSignup");
    // remove jwt token from backend
    let response = axios.post(import.meta.env.VITE_API_URL + "/users/signout");
  }
  function handleCloseLoginSignupPageClose() {
    setView("home");
  }
  function handleBackClick() {
    setView("menuBar");
    // setSelectedMenuIndex(-1);
    setSelectedEntityIndex(-1);
  }
  function handleLoginSignupClick() {
    setView("loginSignup");
  }
  if (flagLoad) {
    return (
      <div className="my-5 text-center">
        <BeatLoader size={24} color={"blue"} />
      </div>
    );
  }
  return (
    <div className="mycontainer">
      <div className="row justify-content-center p-4">
        {view == "menuBar" && (
          <div className="col-12 ">
            <MenuBar
              user={user}
              menus={menus}
              selectedMenuIndex={selectedMenuIndex}
              selectedEntityIndex={selectedEntityIndex}
              onEntityClick={handleEntityClick}
              onSideBarMenuClick={handleSideBarMenuClick}
              onToggleSidebar={handleToggleSidebar}
              onLogInSignupButtonClick={handleLogInSignupButtonClick}
              // onSignoutClick={handleSignoutClick}
              onLogoutClick={handleLogoutClick}
            />
          </div>
        )}
        <div className={"col-12"}>
          {message && (
            <div className="text-center bg-danger text-white w-50 mx-auto mb-2 p-1">
              {message.toUpperCase()}
            </div>
          )}
          {view == "home" && (
            <HomePage user={user} onLoginSignupClick={handleLoginSignupClick} />
          )}{" "}
          {!user && view == "loginSignup" && (
            <LoginSignupPage
              setLoggedinUser={setLoggedinUser}
              onCloseLoginSignupPageClose={handleCloseLoginSignupPageClose}
            />
          )}
          {view == "content" && (
            <ContentPage
              selectedEntity={selectedEntity}
              user={user}
              onBackClick={handleBackClick}
            />
          )}
        </div>
      </div>
    </div>
  );
}
