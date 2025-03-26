import { useState } from "react";
import Modal from "./modal";

export default function AnItem(props) {
  let [flagDeleteButtonPressed, setFlagDeleteButtonPressed] = useState(false);
  let { item } = props;
  let { sortedField } = props;
  let { direction } = props;
  let { index } = props;
  let { attributes } = props;
  let { selectedEntity } = props;
  let { listSize } = props;
  function handleEditButtonClick() {
    props.onEditButtonClick(item);
  }

  function handleDeleteButtonClick() {
    setFlagDeleteButtonPressed(true);
  }
  function handleModalCloseClick() {
    setFlagDeleteButtonPressed(false);
  }
  function handleModalButtonClick(event) {
    let ans = event.target.innerHTML;

    setFlagDeleteButtonPressed(false);

    props.onDeleteButtonClick(ans, item);
  }
  function getNameFromId(id, index) {
    let obj = selectedEntity.attributes[index].optionList.find(
      (e, i) => e._id == id
    );

    return obj.name;
  }
  return (
    <>
      <div className="row justify-content-between my-2 mx-auto border border-2 border-secondary p-1">
        <div className="col-1">
          {sortedField == "updateDate" && !direction
            ? index + 1
            : listSize - index}
          .
        </div>
        {attributes.map(
          (e, index) =>
            e.showInList && (
              <div key={index} className="col-2">
                {e.type != "dropdown"
                  ? String(item[e.id]).length <= 20
                    ? item[e.id]
                    : item[e.id].slice(0, 20) + "..."
                  : getNameFromId(item[e.id], index)}
              </div>
            )
        )}

        <div className="col-1">
          <span onClick={handleEditButtonClick}>
            <i className="bi bi-pencil-square"></i>
          </span>
          &nbsp;{" "}
          <span onClick={handleDeleteButtonClick}>
            <i className="bi bi-trash3-fill"></i>
          </span>
          {/* <button className="btn btn-primary"></button>
          <button className="btn btn-danger"></button> */}
        </div>
        {/* <div className="col-1"></div> */}
      </div>
      {flagDeleteButtonPressed && (
        <Modal
          modalText={"Do you really want to delete data of " + item.name}
          btnGroup={["Yes", "No"]}
          onModalCloseClick={handleModalCloseClick}
          onModalButtonClick={handleModalButtonClick}
        />
      )}
    </>
  );
}
