import { useEffect, useState } from "react";
import SideBar from "./SideBar";
import ContentPage from "./ContentPage";
import HomePage from "./HomePage";
import LoginSignupPage from "./LoginSignupPage";
import axios from "axios";
import { BeatLoader } from "react-spinners";
import DatePicker from "react-datepicker";

export default function RestaurantHomePage() {
  let [selectedEntity, setSelectedEntity] = useState("");
  let [flagToggleButton, setFlagToggleButton] = useState(false);
  let [user, setUser] = useState("");
  let [view, setView] = useState("home");
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
          isReady: true,
          accessLevel: "D",
        },
        {
          name: "Customers",
          singularName: "Customer",
          addFacility: true,
          isReady: true,
          accessLevel: "D",
        },
        {
          name: "Product Categories",
          singularName: "Category",
          addFacility: true,
          isReady: false,
          accessLevel: "A",
        },
        {
          name: "Site Visits",
          singularName: "Site Visit",
          addFacility: true,
          isReady: false,
          accessLevel: "D",
        },
        {
          name: "Quotations",
          singularName: "Quotation",
          addFacility: true,
          isReady: false,
          accessLevel: "D",
        },
        {
          name: "Purchase Orders",
          singularName: "Purchase order",
          isReady: false,
          accessLevel: "D",
        },
        {
          name: "Material Dispatch",
          singularName: "Material Dispatch",
          isReady: false,
          addFacility: true,
          accessLevel: "D",
        },
        {
          name: "Site Installations",
          singularName: "Site Installation",
          isReady: false,
          addFacility: true,
          accessLevel: "D",
        },
        {
          name: "Projects done",
          singularName: "Projects done",
          addFacility: true,
          isReady: false,
          accessLevel: "D",
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
          name: "Activity Report",
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
      let response = await axios.get(
        import.meta.env.VITE_API_URL + "/specials/welcome"
      );
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
  function handleEntityClick(selectedIndex) {
    // user clicked to same entity again, so unselect it
    console.log(menus[selectedMenuIndex].entities[selectedIndex].name);

    if (
      selectedEntity.name ==
      menus[selectedMenuIndex].entities[selectedIndex].name
    ) {
      setSelectedMenuIndex(-1);
      setSelectedEntityIndex(-1);
      setView("home");
      return;
    }
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
    let response = axios.post(import.meta.env.VITE_API_URL + "/users/signout");
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
    <>
      <div className="row justify-content-center p-4">
        {true && (
          <div className="col-2 ">
            <SideBar
              user={user}
              menus={menus}
              flagToggleButton={flagToggleButton}
              selectedMenuIndex={selectedMenuIndex}
              selectedEntityIndex={selectedEntityIndex}
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
    </>
  );
}
