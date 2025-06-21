import { useState } from "react";
import Modal from "./Modal";
import { isImage } from "../utilities";

export default function AEnquiryRemark(props) {
  let [flagDeleteButtonPressed, setFlagDeleteButtonPressed] = useState(false);
  let { enquiryRemark } = props;
  let { showInList } = props;
  let { sortedField } = props;
  let { direction } = props;
  let { index } = props;
  let { selectedEntity } = props;
  let { listSize } = props;
  function handleEditButtonClick() {
    props.onEditButtonClick(enquiryRemark);
  }

  function handleDeleteButtonClick() {
    if (listSize <= 1) {
      props.onInvalidDeleteButtonClick("At least one remark is required.");
      return;
    }
    setFlagDeleteButtonPressed(true);
  }
  function handleModalCloseClick() {
    setFlagDeleteButtonPressed(false);
  }
  function handleModalButtonClick(ans) {
    setFlagDeleteButtonPressed(false);
    props.onDeleteButtonClick(ans, enquiryRemark);
  }
  function getNameFromId(id, index) {
    let obj = selectedEntity.attributes[index].optionList.find(
      (e, i) => e._id == id
    );
    return obj.name;
  }

  function handleToggleText(index) {
    console.log(index);
    console.log(showInList[index].flagReadMore);
    props.onToggleText(index);
  }
  function handleShowNonImgFileClick(fileName) {
    window.open(
      import.meta.env.VITE_API_URL + "/uploadedImages/" + fileName,
      "_blank"
    );
  }
  return (
    <>
      <div className="row my-2 mx-auto border border-1 border-secondary p-1">
        <div className="col-1">
          {sortedField == "updateDate" && !direction
            ? index + 1
            : listSize - index}
          .
        </div>{" "}
        {showInList.map(
          (e, index) =>
            e.show && (
              <div key={index} className="col-2">
                <>
                  {e.type == "normal" && enquiryRemark[e.attribute]}
                  {e.type == "singleFile" &&
                    (e.allowedFileType == "image" ||
                      (e.allowedFileType == "all" &&
                        isImage(enquiryRemark[e.attribute]))) && (
                      <img
                        className="img-fluid"
                        src={
                          import.meta.env.VITE_API_URL +
                          "/uploadedImages/" +
                          enquiryRemark[e.attribute]
                        }
                        alt="Unavailable"
                      />
                    )}
                  {e.type == "singleFile" &&
                    e.allowedFileType == "all" &&
                    !isImage(enquiryRemark[e.attribute]) && (
                      <a
                        href="#"
                        onClick={() => {
                          handleShowNonImgFileClick(enquiryRemark[e.attribute]);
                        }}
                      >
                        {enquiryRemark[e.attribute].slice(0, 10)}...
                        {enquiryRemark[e.attribute].slice(
                          enquiryRemark[e.attribute].length - 5
                        )}
                      </a>
                    )}
                  {e.type == "text-area" &&
                    e.flagReadMore &&
                    enquiryRemark[e.attribute]}
                  {e.type == "text-area" &&
                    !e.flagReadMore &&
                    enquiryRemark[e.attribute].slice(0, 50)}
                  {e.type == "text-area" && (
                    <button
                      className="btn btn-link"
                      onClick={() => {
                        handleToggleText(index);
                      }}
                    >
                      Read {e.flagReadMore ? "Less" : "More"}
                    </button>
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
        </div>
        <div className="col-12   text-italic text-small">
          <span className="text-dark">{enquiryRemark.user}</span>{" "}
          <span className="text-secondary">
            (
            {new Date(enquiryRemark.updateDate).toLocaleString("en-IN", {
              timeZone: "Asia/Kolkata",
            })}
            )
          </span>
        </div>
      </div>
      {flagDeleteButtonPressed && (
        <Modal
          modalText={"Do you really want to delete this record"}
          btnGroup={["Yes", "No"]}
          onModalCloseClick={handleModalCloseClick}
          onModalButtonClick={handleModalButtonClick}
        />
      )}
    </>
  );
}
