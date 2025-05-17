import { useEffect, useState } from "react";
import SideBar from "./SideBar";
import ContentPage from "./ContentPage";
import HomePage from "./HomePage";
import LoginSignupPage from "./LoginSignupPage";
import axios from "axios";
import { BeatLoader } from "react-spinners";

export default function RestaurantHomePage() {
  let [selectedEntity, setSelectedEntity] = useState("");
  let [flagToggleButton, setFlagToggleButton] = useState(false);
  let [user, setUser] = useState("");
  let [view, setView] = useState("home");
  let [flagLoad, setFlagLoad] = useState(false);
  let [message, setMessage] = useState("");
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
    setFlagLoad(true);
    try {
      let response = await axios.get("http://localhost:3000/specials/welcome");
      if (response.data.role != "new" && response.data.role != "guest") {
        // user is alreay logged in and has refreshed the page
        setUser(response.data);
      }
    } catch (error) {
      showMessage("Something went wrong, refresh the page");
    }
    setFlagLoad(false);
  }
  function showMessage(message) {
    setMessage(message);
    window.setTimeout(() => {
      setMessage("");
    }, 3000);
  }
  function handleEntityClick(selectedMenuIndex, selectedIndex) {
    setSelectedEntity(menus[selectedMenuIndex].entities[selectedIndex]);
    setView("content");
  }
  function handleSideBarMenuClick() {
    setSelectedEntity("");
    setView("home");
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
    // let response = await axios.get(
    //   "http://localhost:3000/roles/" + loggedinUser.roleId
    // );
    // loggedinUser.level = response.data.level;
    setUser(loggedinUser);
  }
  function handleSignoutClick() {
    setUser("");
    setView("home");
    // remove jwt token from backend
    let response = axios.post("http://localhost:3000/users/signout");
  }
  function handleCloseLoginSignupPageClose() {
    setView("home");
  }
  if (flagLoad) {
    return (
      <div className="my-5 text-center">
        <BeatLoader size={24} color={"blue"} />
      </div>
    );
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
      <div className={flagToggleButton ? "col-10" : "col-12"}>
        {message && (
          <div className="text-center bg-danger text-white w-50 mx-auto mb-2 p-1">
            {message.toUpperCase()}
          </div>
        )}
        {view == "home" && <HomePage user={user} />}
        {!user && view == "loginSignup" && (
          <LoginSignupPage
            setLoggedinUser={setLoggedinUser}
            onCloseLoginSignupPageClose={handleCloseLoginSignupPageClose}
          />
        )}
        {view == "content" && <ContentPage selectedEntity={selectedEntity} />}
      </div>
    </div>
  );
}
