import { useState } from "react";
import Modal from "./modal";

export default function AnItem(props) {
  let [flagDeleteButtonPressed, setFlagDeleteButtonPressed] = useState(false);
  let { item } = props;
  let { index } = props;
  let { attributes } = props;
  let { selectedEntity } = props;
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
    console.log(ans + ",,,,");

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
      <div className="row my-2 mx-auto border border-2 border-secondary p-1">
        <div className="col-1">{index + 1}.</div>
        {attributes.map(
          (e, index) =>
            e.showInList && (
              <div key={index} className="col-2">
                {e.type != "dropdown"
                  ? item[e.id]
                  : getNameFromId(item[e.id], index)}
              </div>
            )
        )}

        <div className="col-1">
          <button className="btn btn-primary" onClick={handleEditButtonClick}>
            <i className="bi bi-pencil-square"></i>
          </button>
        </div>
        <div className="col-1">
          <button className="btn btn-danger" onClick={handleDeleteButtonClick}>
            <i className="bi bi-trash3-fill"></i>
          </button>
        </div>
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
