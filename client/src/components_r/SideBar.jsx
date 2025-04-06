import { useState } from "react";

export default function SideBar(props) {
  let { entities } = props;
  let [selectedIndex, setSelectedIndex] = useState(-1);
  let [selectedDashboardMenuIndex, setSelectedDashboardMenuIndex] = useState(0);
  function handleSideBarOptionClick(index) {
    setSelectedIndex(index);
    props.onEntityClick(index);
  }
  function handleDashboardMenuClick(index) {
    setSelectedDashboardMenuIndex(index);
  }
  let dashboardList = ["Manage Data", "Settings", "Reports"];
  return (
    <div className="row bg-danger text-start container-sidebar p-3">
      <div className="btn-group dropend">
        <button
          type="button"
          className="btn btn-black dropdown-toggle"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          DashBoard
        </button>
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
                ? " bg-white text-danger"
                : "bg-danger text-white")
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
  );
}
