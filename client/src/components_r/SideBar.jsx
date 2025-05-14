import { useState } from "react";
import "../SideBar.css";

export default function SideBar(props) {
  let { entities } = props;
  let { flagToggleButton } = props;
  let [selectedIndex, setSelectedIndex] = useState(-1);
  let [selectedDashboardMenuIndex, setSelectedDashboardMenuIndex] = useState(0);
  function handleSideBarOptionClick(index) {
    setSelectedIndex(index);
    props.onEntityClick(index);
  }
  function handleDashboardMenuClick(index) {
    setSelectedDashboardMenuIndex(index);
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
          <button className="close-btn" onClick={toggleSidebar}>
            ×
          </button>
          <div className="btn-group dropend">
            <ul className="dropdown-menu">
              {dashboardList.map((e, index) => (
                <li key={index}>
                  <a
                    className="dropdown-item"
                    onClick={() => {
                      handleDashboardMenuClick(index);
                    }}
                    href="#"
                  >
                    {e}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          {entities.map((e, index) => (
            <div className="text-start" key={index}>
              <button
                className={
                  "btn btn-sidebar my-2 border " +
                  (index == selectedIndex
                    ? "bg-white text-primary"
                    : " text-white")
                }
                onClick={() => {
                  handleSideBarOptionClick(index);
                }}
              >
                {e.name}
              </button>
            </div>
          ))}
        </div>
        {/* col-11 ends */}
      </div>
    </>
  );
}
