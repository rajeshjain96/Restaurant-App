import { useRef, useState } from "react";

export default function SingleFileUpload(props) {
  let { action } = props;
  let { name } = props;
  let { fileName } = props;
  let { singleFileList } = props;
  let [previewImage, setPreviewImage] = useState(false);
  // following is for update mode
  let [previewExistingImage, setPreviewExistingImage] = useState(true);
  // let [message, setMessage] = useState("");
  let [file, setFile] = useState("");
  let [flagImageUploaded, setFlagImageUploaded] = useState("");
  let [flagImageChange, setFlagImageChange] = useState("");
  let [image, setImage] = useState("");
  let [fileIndex, setFileIndex] = useState(getFileIndex());
  const buttonBRef = useRef(null);

  function getFileIndex() {
    for (let index = 0; index < singleFileList.length; index++) {
      let e = singleFileList[index];
      if (e["fileAttributeName"] == name) {
        return index;
      } //if
    } //for
  }
  function handleChangeImageClick() {
    setFlagImageChange(true);
    if (buttonBRef.current) {
      buttonBRef.current.click(); // trigger Button B click
    }
  }
  function handleCancelChangeImageClick() {
    // setMessage("");
    setFile("");
    setPreviewImage("");
    setFlagImageChange(false);
    props.onCancelChangeImageClick(product);
  }
  function fileChangedHandler(event) {
    let file = event.target.files[0];
    if (!file) {
      // setMessage("");
      setPreviewImage("");
      return;
    }
    // obj["fileAttributeName"] = e.attribute;
    //   obj["allowedFileType"] = e.allowedFileType;
    //   obj["allowedSize"] = e.allowedSize;
    //   list.push(obj);
    let fileType = file.type.substring(0, file.type.indexOf("/"));
    if (fileType != "image") {
      // setMessage("Invalid file...");
      setFile("");
    }
    //  else if (file.size > 5000) {
    //   setState({ message: "File-size should be below 5kb" });
    // }
    else {
      // setMessage("");
      let previewImage = URL.createObjectURL(file);
      setFile(file);
      setPreviewImage(previewImage);
      props.onFileChange(file, fileIndex);
    }
  }
  function fileChangedHandlerUpdateMode(event) {
    let file = event.target.files[0];
    console.log(file);

    let message = "";
    if (!file) {
      // setMessage("");
      setPreviewImage("");
      return;
    }
    // obj["fileAttributeName"] = e.attribute;
    //   obj["allowedFileType"] = e.allowedFileType;
    //   obj["allowedSize"] = e.allowedSize;
    //   list.push(obj);
    console.log(singleFileList[fileIndex].allowedFileType);
    // image/jpeg, image/png, application/pdf, video/mp4,
    //application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
    if (file.type.indexOf(singleFileList[fileIndex].allowedFileType) == -1) {
      message =
        "The file-type should be " + singleFileList[fileIndex].allowedFileType;
      let previewImage = URL.createObjectURL(file);
      setFile(file);
      setPreviewImage(previewImage);
      setPreviewExistingImage(false);
    } else if (
      file.size >
      singleFileList[fileIndex].allowedSize * 1024 * 1024
    ) {
      message =
        "The file-size should be maximum " +
        singleFileList[fileIndex].allowedSize +
        " MB";
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
    props.onFileChangeUpdateMode(null, fileIndex, "");
  }
  function handleSaveProductImage() {
    let { product } = props;
    let { shopUrl } = props;
    // save this product
    setFlagLoad(true);
    axios
      // .put("/products/" + shopUrl + "/" + product.productId, product)
      .put(window.routerPrefix + "/product/update/" + shopUrl, product)
      .then((res) => {
        setFlagLoad(false);
        props.onSaveProductImage(product);
      })
      .catch((err) => {
        setError(err);
        setFlagLoad(false);
      });
  }
  function handleChange(event) {
    let userInput = event.target.checked;
    let { product } = props;
    props.onInStockCheckBoxChange(product, Number(userInput));
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
                src={"http://localhost:3000/uploadedImages/" + fileName}
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
                // ref={buttonBRef}
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
