import { useRef, useState } from "react";

export default function SingleFileUploadSpecial(props) {
  let { action } = props;
  let { fileName } = props;
  let { allowedFileType } = props;
  let { allowedSize } = props;
  let [previewImage, setPreviewImage] = useState(false);
  let [previewExistingImage, setPreviewExistingImage] = useState(true);
  let [file, setFile] = useState("");
  let [flagImageUploaded, setFlagImageUploaded] = useState("");
  let [flagImageChange, setFlagImageChange] = useState("");
  let [image, setImage] = useState("");
  const buttonARef = useRef(null);
  const buttonBRef = useRef(null);
  function handleChangeImageClick() {
    setFlagImageChange(true);
    if (buttonBRef.current) {
      buttonBRef.current.click(); // trigger Button B click
    }
  }
  function fileChangedHandler(event) {
    let file = event.target.files[0];
    let previewImage = null;
    let message = "";
    if (!file) {
      setPreviewImage("");
      return;
    }
    // image/jpeg, image/png, application/pdf, video/mp4,
    //application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
    console.log(file.type);
    if (allowedFileType == "all") {
      if (
        file.type.indexOf("image") == -1 &&
        file.type.indexOf("pdf") == -1 &&
        file.type.indexOf("spreadsheet") == -1 &&
        file.type.indexOf("text") == -1
      ) {
        message = "The " + file.type + " file-type is not allowed";
      }
    } else if (file.type.indexOf(allowedFileType) == -1) {
      message = "The file-type should be " + allowedFileType;
    } else if (file.size > allowedSize * 1024 * 1024) {
      message = "The file-size should be maximum " + allowedSize + " MB";
    }
    if (file.type.indexOf("image") != -1)
      previewImage = URL.createObjectURL(file);
    // else {
    //   if (allowedFileType == "image") previewImage = URL.createObjectURL(file);
    // }
    setFile(file);
    setPreviewImage(previewImage);
    setPreviewExistingImage(false);
    props.onFileChange(file, message);
  }
  function fileChangedHandlerUpdateMode(event) {
    let file = event.target.files[0];
    let message = "";
    if (!file) {
      // setMessage("");
      setPreviewImage("");
      return;
    }
    // image/jpeg, image/png, application/pdf, video/mp4,
    //application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
    if (file.type.indexOf("image") == -1) {
      message = "The file-type should be image";
      let previewImage = URL.createObjectURL(file);
      setFile(file);
      setPreviewImage(previewImage);
      setPreviewExistingImage(false);
    } else if (file.size > allowedSize * 1024 * 1024) {
      message = "The file-size should be maximum " + allowedSize + " MB";
      let previewImage = URL.createObjectURL(file);
      setFile(file);
      setPreviewImage(previewImage);
      setPreviewExistingImage(false);
    } else {
      let previewImage = URL.createObjectURL(file);
      setFile(file);
      setPreviewImage(previewImage);
      setPreviewExistingImage(false);
    }
    props.onFileChangeUpdateMode(file, fileIndex, message);
  }
  function handleFileRemove() {
    setFile(null);
    setPreviewImage(null);
    setPreviewExistingImage(true);
    if (action == "add") {
      if (buttonARef.current) {
        buttonARef.current.value = ""; //
      }
    }
    props.onFileRemove(null, fileIndex, "");
  }

  return (
    <>
      {/* within a row */}
      <div className="">
        {flagImageUploaded && <span className="">(Updated...)</span>}
      </div>
      {/* row begins */}

      {(!flagImageChange || !previewImage || previewImage) && (
        <div className="text-center ">
          <img className="div-product-image" src={"/uploads/" + image} alt="" />
        </div>
      )}

      <div className="">
        <div className=" ">
          {/* {flagImageChange  && (
            <div className="col-12 text-center text-red">{message}</div>
          )} */}
          {action == "update" && previewExistingImage && (
            <>
              <img
                className="fileUpload-image"
                src={
                  import.meta.env.VITE_API_URL + "/uploadedImages/" + fileName
                }
                alt=""
              />
            </>
          )}
          {action == "add" && (
            <div className="my-2">
              <input
                className=""
                type="file"
                name="file"
                ref={buttonARef}
                onChange={fileChangedHandler}
              />
            </div>
          )}
          {/*  For update mode, this dummy button is used. When it is clicked, file handler is clicked */}
          {action == "update" && (
            <div className="my-2">
              <input
                className=""
                type="file"
                name="file"
                ref={buttonBRef}
                onChange={fileChangedHandlerUpdateMode}
                style={{ opacity: 0, position: "absolute", zIndex: -1 }}
              />
            </div>
          )}
          {action == "update" && (
            <div className="my-2">
              <button type="button" onClick={handleChangeImageClick}>
                Change Image
              </button>
            </div>
          )}
          {previewImage && (
            <div className="position-relative d-inline-block mt-2">
              <img className="fileUpload-image" src={previewImage} alt="" />
              <button
                type="button"
                className="btn btn-sm btn-danger position-absolute top-0 end-0"
                onClick={handleFileRemove}
              >
                &times;
              </button>
            </div>
          )}
          {/* <div className="my-2">
            {previewImage && (file.size / 1000000).toFixed(2) + "MB"}
          </div> */}
        </div>
      </div>
      <div className=""></div>
    </>
  );
}
