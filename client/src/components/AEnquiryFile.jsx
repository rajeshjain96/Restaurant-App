import { useState } from "react";
import Modal from "./Modal";
import { isImage } from "../external/vite-sdk";

export default function AEnquiryFile(props) {
  let [flagDeleteButtonPressed, setFlagDeleteButtonPressed] = useState(false);
  let { enquiryFile } = props;
  let { showInList } = props;
  let { sortedField } = props;
  let { direction } = props;
  let { index } = props;
  let { selectedEntity } = props;
  let { listSize } = props;
  function handleEditButtonClick() {
    props.onEditButtonClick(enquiryFile);
  }

  function handleDeleteButtonClick() {
    setFlagDeleteButtonPressed(true);
  }
  function handleModalCloseClick() {
    setFlagDeleteButtonPressed(false);
  }
  function handleModalButtonClick(ans) {
    setFlagDeleteButtonPressed(false);
    props.onDeleteButtonClick(ans, enquiryFile);
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
  function handleLinkCopyClick(index) {
    // let en={...enquiry};
    navigator.clipboard.writeText(
      window.location.host + "/" + enquiryFile.urlEndPoint
    );
    props.onLinkCopyClick(index);
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
        {showInList.map(
          (e, index) =>
            e.show && (
              <div key={index} className="col-2">
                <>
                  {e.type == "normal" && enquiryFile[e.attribute]}
                  {e.type == "singleFile" &&
                    (e.allowedFileType == "image" ||
                      (e.allowedFileType == "all" &&
                        isImage(enquiryFile[e.attribute]))) && (
                      <img
                        className="img-fluid"
                        src={
                          import.meta.env.VITE_API_URL +
                          "/uploadedImages/" +
                          enquiryFile[e.attribute]
                        }
                        alt="Unavailable"
                      />
                    )}
                  {e.type == "singleFile" &&
                    e.allowedFileType == "all" &&
                    !isImage(enquiryFile[e.attribute]) && (
                      <a
                        href="#"
                        onClick={() => {
                          handleShowNonImgFileClick(enquiryFile[e.attribute]);
                        }}
                      >
                        {enquiryFile[e.attribute].slice(0, 10)}...
                        {enquiryFile[e.attribute].slice(
                          enquiryFile[e.attribute].length - 5
                        )}
                      </a>
                    )}
                  {e.type == "text-area" &&
                    e.flagReadMore &&
                    enquiryFile[e.attribute]}
                  {e.type == "text-area" &&
                    !e.flagReadMore &&
                    enquiryFile[e.attribute].slice(0, 50)}
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
          <span className="text-dark">{enquiryFile.user}</span>{" "}
          <span className="text-secondary">
            (
            {new Date(enquiryFile.updateDate).toLocaleString("en-IN", {
              timeZone: "Asia/Kolkata",
            })}
            )
          </span>
        </div>
        <div className="my-1">
          <a
            // className={"text-small text-white p-1 bg-dark"}
            className={
              "text-small text-white p-1 " +
              (enquiryFile.flagClicked ? "bg-danger" : "bg-dark")
            }
            href="#"
            onClick={() => {
              handleLinkCopyClick(index);
            }}
          >
            {" "}
            {enquiryFile.flagClicked ? "Copied" : "Copy Link:"}
          </a>{" "}
          <span>
            <a
              href={"/" + enquiryFile.urlEndPoint}
              target="_blank"
              title="Client Resources"
            >
              {"/" + enquiryFile.urlEndPoint}
            </a>
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
