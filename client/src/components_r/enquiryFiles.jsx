import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import SingleFileUploadSpecial from "./SingleFileUploadSpecial";
import InfoHeader from "./infoHeader";
import Modal from "./Modal";
import AEnquiryFile from "./AEnquiryFile";
export default function EnquiryFiles() {
  const [params] = useSearchParams();
  const id = params.get("id");
  const productId = params.get("productId");
  const user = params.get("user");
  let [flagLoad, setFlagLoad] = useState(false);
  let [action, setAction] = useState("add");
  let [message, setMessage] = useState("");
  let [enquiry, setEnquiry] = useState({});
  let [enquiryId, setEnquiryId] = useState({});
  let [fileInfo, setFileInfo] = useState([]);
  let [flagDeleteButtonPressed, setFlagDeleteButtonPressed] = useState(false);
  let [formObject, setFormObject] = useState({});
  let [remark, setRemark] = useState("");
  let [enquiryFileName, setEnquiryFileName] = useState("");
  let [selectedIndex, setSelectedIndex] = useState(-1);
  useEffect(() => {
    getData();
  }, []);
  async function getData() {
    setFlagLoad(true);
    try {
      let response1 = await axios(
        import.meta.env.VITE_API_URL + "/enquiries/" + id
      );
      let response2 = await axios(
        import.meta.env.VITE_API_URL + "/products/" + productId
      );
      let enq = response1.data;
      let pr = response2.data;
      if (enq == "Unauthorized") {
        showMessage("Session over. Login again");
      } else {
        enq.product = pr.name;
        setEnquiry(enq);
        setEnquiryId(enq._id);
        setFileInfo(enq.fileInfo);
        document.title = enq.name;
      }
    } catch (error) {
      console.log(error);
      showMessage("Something went wrong, refresh the page");
    }
    setFlagLoad(false);
  }
  function handleWhatsappClick() {
    let message = "";
    let url =
      `https://api.whatsapp.com/send?phone=${enquiry.mobileNumber}&text=` +
      message;
    window.open(url, "_blank");
  }
  async function handleFormSubmit(event) {
    event.preventDefault();
    setFlagLoad(true);
    // add user
    formObject.user = user;
    try {
      let response = await axios.post(
        import.meta.env.VITE_API_URL + "/enquiries/" + id + "/fileInfo",
        formObject,
        { headers: { "Content-type": "multipart/form-data" } }
      );
      let r = await response.data;
      let fInfo = [...fileInfo];
      fInfo.push(r);
      setFileInfo(fInfo);
      clearForm();
    } catch (error) {
      console.log(error);
      showMessage("Something went wrong, refresh the page");
    }
    setFlagLoad(false);
  }
  function clearForm() {
    const clearedData = {};
    for (let key in formObject) {
      clearedData[key] = "";
    }
    setFormObject(clearedData);
  }
  function handleTextAreaChange(event) {
    setFormObject({ ...formObject, [event.target.name]: event.target.value });
  }
  function handleFileChange(selectedFile, message) {
    if (action == "add") {
      setFormObject({
        ...formObject,
        ["file" + 0]: selectedFile,
        enquiryFileName: selectedFile.name,
      });
    }
    showMessage(message);
  }
  function handleFileRemove() {
    if (action == "add") {
      setFormObject({
        ...formObject,
        enquiryFileName: "",
      });
    } else if (action == "update") {
    }
  }
  function handleFileChangeUpdateMode(selectedFile, fileIndex, message) {
    let newFileName = "";
    if (selectedFile) {
      newFileName = selectedFile.name;
    } else {
      // user selected a new file but then deselected
      newFileName = "";
    }
    setFormObject({
      ...formObject,
      // file: file,
      ["file" + fileIndex]: selectedFile,
      ["enquiryFileName" + "New"]: newFileName,
    });
  }
  function handleCancelChangeImageClick() {
    if (action == "update") {
      let fl = [...singleFileList];
      fl[fileIndex]["newFileName"] = "";
      fl[fileIndex]["newFile"] = "";
      setSingleFileList(fl);
    }
  }

  if (flagLoad) {
    return (
      <div className="my-5 text-center">
        <BeatLoader size={24} color={"blue"} />
      </div>
    );
  }
  function handleLinkCopyClick(index) {
    // let en={...enquiry};
    navigator.clipboard.writeText(
      window.location.hostname +
        "/resources?enquiry_id=" +
        enquiry._id +
        "?index=" +
        (fileInfo.length - 1 - index)
    );
    let fInfo = [...fileInfo];
    for (let i = 0; i < fInfo.length; i++) {
      if (index == i) {
        fInfo[i].flagClicked = true;
      } else {
        fInfo[i].flagClicked = false;
      }
    }
    setFileInfo(fInfo);
  }
  function handleDeleteButtonClick(index) {
    setFlagDeleteButtonPressed(true);
    setSelectedIndex(index);
  }
  async function performDeleteOperation() {
    try {
      let response = await axios.delete(
        import.meta.env.VITE_API_URL +
          "/enquiries/" +
          id +
          "/fileInfo/" +
          fileInfo[selectedIndex]._id
      );
      let fInfo = fileInfo.filter((e) => e._id != fileInfo[selectedIndex]._id);
      setFileInfo(fInfo);
      showMessage("Delete operation successful");
    } catch (error) {
      console.log(error);
    }
  }
  function handleModalCloseClick() {
    setFlagDeleteButtonPressed(false);
  }
  function handleModalButtonClick(ans) {
    setFlagDeleteButtonPressed(false);
    if (ans == "No") {
      // delete operation cancelled
      showMessage("Delete operation cancelled");
    } else if (ans == "Yes") {
      // delete operation allowed
      performDeleteOperation();
    }
  }
  function showMessage(message) {
    setMessage(message);
    window.setTimeout(() => {
      setMessage("");
    }, 3000);
  }
  return (
    <>
      <InfoHeader
        enquiry={enquiry}
        message={message}
        onWhatsappClick={handleWhatsappClick}
      />
      {/* {message && <div className="my-5 text-center text-danger">{message}</div>} */}
      <div className="container container-enquiry-files">
        <form onSubmit={handleFormSubmit}>
          <div className="row">
            <div className="col-6">
              <textarea
                cols="40"
                rows="5"
                style={{ resize: "none", padding: "5px" }}
                name="remark"
                value={formObject.remark}
                id=""
                placeholder="Add File Information here"
                onChange={handleTextAreaChange}
              ></textarea>
            </div>
            <div className="col-4">
              <SingleFileUploadSpecial
                action="add"
                name="enquiryFileName"
                fileName={enquiryFileName}
                allowedFileType="all"
                allowedSize={2}
                onFileChange={handleFileChange}
                onFileChangeUpdateMode={handleFileChangeUpdateMode}
                onCancelChangeImageClick={handleCancelChangeImageClick}
                onFileRemove={handleFileRemove}
              />
            </div>
            <div className="col-2">
              <button className="btn btn-primary" type="submit">
                Add
              </button>
            </div>
          </div>
        </form>
        <div className="container">
          {fileInfo.length != 0 && (
            <>
              {fileInfo
                .slice()
                .reverse()
                .map((e, index) => (
                  <AEnquiryFile
                    key={index}
                    enquiryFile={e}
                    enquiry={enquiry}
                    shownIndex={fileInfo.length - 1 - index}
                    onLinkCopyClick={handleLinkCopyClick}
                    onDeleteButtonClick={handleDeleteButtonClick}
                  />
                ))}
            </>
          )}
          {fileInfo.length == 0 && (
            <div className="row ">Nothing is added yet.</div>
          )}
        </div>
      </div>
      {flagDeleteButtonPressed && (
        <Modal
          modalText={"Do you really want to delete the selected record."}
          btnGroup={["Yes", "No"]}
          onModalCloseClick={handleModalCloseClick}
          onModalButtonClick={handleModalButtonClick}
        />
      )}
    </>
  );
}
