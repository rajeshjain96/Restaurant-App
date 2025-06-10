import { useState } from "react";
import Modal from "./Modal";

export default function AQuotation(props) {
  let [flagDeleteButtonPressed, setFlagDeleteButtonPressed] = useState(false);
  let { quotation } = props;
  let { showInList } = props;
  let { sortedField } = props;
  let { direction } = props;
  let { index } = props;
  let { selectedEntity } = props;
  let { listSize } = props;
  function handleEditButtonClick() {
    props.onEditButtonClick(quotation);
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

    props.onDeleteButtonClick(ans, quotation);
  }
  function getNameFromId(id, index) {
    let obj = selectedEntity.attributes[index].optionList.find(
      (e, i) => e._id == id
    );
    return obj.name;
  }
  return (
    <>
      <div className="row my-2 mx-auto border border-1 border-secondary p-1">
        <div className="col-1">
          {sortedField == "updateDate" && !direction
            ? index + 1
            : listSize - index}
          .
        </div>

        {/* <div key={index} className="col-2">
          {quotation.name}
        </div> */}
        {showInList.map(
          (e, index) =>
            e.show && (
              <div key={index} className="col-2">
                <>
                  {e.type != "singleFile" && quotation[e.attribute]}
                  {e.type == "singleFile" && e.allowedFileType == "image" && (
                    <img
                      className="img-fluid"
                      src={
                        import.meta.env.VITE_API_URL +
                        "/uploadedImages/" +
                        quotation[e.attribute]
                      }
                    />
                  )}
                  {e.type == "singleFile" && e.allowedFileType == "pdf" && (
                    <a
                      href={
                        import.meta.env.VITE_API_URL +
                        "/uploadedImages/" +
                        quotation[e.attribute]
                      }
                      target="_blank"
                    >
                      {quotation[e.attribute]}
                    </a>
                  )}
                </>
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
          modalText={
            'Do you really want to delete data of "' + quotation.name + '".'
          }
          btnGroup={["Yes", "No"]}
          onModalCloseClick={handleModalCloseClick}
          onModalButtonClick={handleModalButtonClick}
        />
      )}
    </>
  );
}
