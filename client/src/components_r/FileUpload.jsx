import { useState } from "react";

export default function FileUpload(props) {
  let { action } = props;
  let { name } = props;
  let { value } = props;
  let [previewImage, setPreviewImage] = useState(false);
  let [message, setMessage] = useState("");
  let [file, setFile] = useState("");
  let [flagImageUploaded, setFlagImageUploaded] = useState("");
  let [flagImageChange, setFlagImageChange] = useState("");
  let [image, setImage] = useState("");
  let [fileIndex, setFileIndex] = useState(getFileIndex());
  function getFileIndex() {
    for (let index = 0; index < props.fileList.length; index++) {
      let e = props.fileList[index];
      if (e["fileAttributeName"] == props.name) {
        return index;
      } //if
    } //for
  }
  function handleChangeImageClick() {
    setFlagImageChange(true);
  }
  function handleCancelChangeImageClick() {
    setMessage("");
    setFile("");
    setPreviewImage("");
    setFlagImageChange(false);
    props.onCancelChangeImageClick(product);
  }
  function handleUploadImageClick() {
    let { product } = props;
    let { shopUrl } = props;
    const formData = new FormData();
    formData.append("imageFile", file);
    // setFlagLoad(true);
    axios
      .post(
        window.routerPrefix +
          "/files/uploadProductImage/" +
          shopUrl +
          "/" +
          product.productId,
        formData,
        {
          headers: {
            accept: "application/json",
          },
        }
      )
      .then((res) => {
        if (res.data != "####") {
          //successfully uploaded
          let image = res.data;
          // uploaded image should be reflected
          props.onUploadProductImage(product, image);
          setPreviewImage(false);
        } else {
          //Error uploading image
        }
        setFlagLoad(false);
      })
      .catch((err) => {
        setError(err);
        setFlagLoad(false);
      });
  }

  function fileChangedHandler(event) {
    let file = event.target.files[0];
    if (!file) {
      setMessage("");
      setPreviewImage("");
      return;
    }
    let fileType = file.type.substring(0, file.type.indexOf("/"));
    if (fileType != "image") {
      setMessage("Invalid file...");
      setFile("");
    }
    //  else if (file.size > 5000) {
    //   setState({ message: "File-size should be below 5kb" });
    // }
    else {
      setMessage("");
      let previewImage = URL.createObjectURL(file);
      setFile(file);
      setPreviewImage(previewImage);
      props.onFileChange(file, fileIndex);
    }
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

      {(!flagImageChange || !previewImage || (previewImage && message)) && (
        <div className="text-center ">
          <img className="div-product-image" src={"/uploads/" + image} alt="" />
        </div>
      )}

      <div className="">
        <div className=" ">
          {flagImageChange && message && (
            <div className="col-12 text-center text-red">{message}</div>
          )}
          {action == "update" && !flagImageChange && (
            <>
              <img
                className="fileUpload-image"
                src={"http://localhost:3000/uploadedImages/" + value}
                alt=""
              />
            </>
          )}
          {previewImage && (
            <img className="fileUpload-image" src={previewImage} alt="" />
          )}{" "}
          {action == "update" && !flagImageChange && (
            <div className="my-2">
              <button
                className=""
                type="button"
                onClick={handleChangeImageClick}
              >
                Change image
              </button>
            </div>
          )}
          {action == "add" && value}
          <div className="my-2">
            {(action == "add" || (action == "update" && flagImageChange)) && (
              <input
                className=""
                type="file"
                name="file"
                onChange={fileChangedHandler}
              />
            )}

            {flagImageChange && (
              <button className={""} onClick={handleCancelChangeImageClick}>
                Cancel
              </button>
            )}
          </div>
          <div className="my-2">
            {previewImage && (file.size / 1000000).toFixed(2) + "MB"}
          </div>
        </div>
      </div>
      <div className=""></div>
    </>
  );
}
