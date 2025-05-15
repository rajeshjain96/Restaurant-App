import { useState } from "react";
import "../SideBar.css";

export default function SideBar(props) {
  let { entities } = props;
  let { menus } = props;
  let { flagToggleButton } = props;
  let [selectedMenuIndex, setSelectedMenuIndex] = useState(-1);
  let [selectedEntityIndex, setSelectedEntityIndex] = useState(-1);
  function handleSideBarMenuClick(index) {
    if (selectedMenuIndex == index) {
      setSelectedMenuIndex(-1);
    } else {
      setSelectedMenuIndex(index);
    }
  }
  function handleSideBarEntityClick(index) {
    setSelectedEntityIndex(index);
    props.onEntityClick(selectedMenuIndex, index);
  }
  function toggleSidebar() {
    // console.log(flagToggleButton);

    // let flag = flagToggleButton;
    // flag = !flag;
    // setFlagToggleButton(flag);
    props.onToggleSidebar();
  }
  let dashboardList = ["Manage Data", "Settings", "Reports"];
  return (
    <>
      {/* <div className="row bg-danger text-start container-sidebar myborder"> */}
      <button className="open-btn bg-primary " onClick={toggleSidebar}>
        ☰
      </button>
      <div
        className={
          "row bg-primary text-start sidebar " +
          (flagToggleButton ? "active" : "")
        }
      >
        <div className="col-12 my-4 text-center">
          <div className="my-3">
            <button className="close-btn" onClick={toggleSidebar}>
              ×
            </button>
          </div>
          {menus.map((e, index) => (
            <>
              <div className="text-start" key={index}>
                <button
                  className={
                    "btn btn-sidebar my-2 border " +
                    (index == selectedMenuIndex
                      ? "bg-dark text-white"
                      : "bg-dark text-white")
                  }
                  onClick={() => {
                    handleSideBarMenuClick(index);
                  }}
                >
                  {e.name}
                </button>
              </div>
              {selectedMenuIndex == index &&
                e.entities.map((ee, indexx) => (
                  <div className="text-start" key={indexx}>
                    <button
                      className={
                        "btn btn-sidebar ms-3 my-2 border " +
                        (indexx == selectedEntityIndex
                          ? "text-white"
                          : "bg-white text-primary")
                      }
                      onClick={() => {
                        handleSideBarEntityClick(indexx);
                      }}
                    >
                      {ee.name}
                    </button>
                  </div>
                ))}
            </>
          ))}
        </div>
        {/* col-11 ends */}
      </div>
    </>
  );
}
