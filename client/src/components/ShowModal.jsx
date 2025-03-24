import { useState } from "react";
import Modal from "./Modal";

export default function ShowModal(props) {
  let [flagShow, setFlagShow] = useState(false);
  function handleModalCloseClick() {
    setFlagShow(false);
  }
  function handleModalButtonClick(index) {
    console.log(index + " is clicked");
    // console.log(btnGroup[index] + " is clicked");
  }
  return (
    <>
      {/* <div className="modal-wrapper"></div> */}
      <div>
        <button
          onClick={() => {
            setFlagShow(true);
          }}
        >
          Show Modal
        </button>
      </div>
      {flagShow && (
        <Modal
          heading="This is Heading"
          modalText="Do you really want to delete"
          btnGroup={["Ok", "Yes", "No"]}
          onModalCloseClick={handleModalCloseClick}
          onModalButtonClick={handleModalButtonClick}
        />
      )}
    </>
  );
}
