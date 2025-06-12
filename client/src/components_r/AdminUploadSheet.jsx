import { useState } from "react";
import * as XLSX from "xlsx";
import axios from "axios";
import { BeatLoader } from "react-spinners";
function AdminUploadSheet(props) {
  let [flagLoad, setFlagLoad] = useState(false);
  let [flagFileSelect, setFlagFileSelect] = useState(false);
  let [flagFileUpload, setFlagFileUpload] = useState(false);
  let [flagSheetAnalysed, setFlagSheetAnalysed] = useState(false);
  let [flagSummaryChecked, setFlagSummaryChecked] = useState(false);
  let [error, setError] = useState("");
  let [message, setMessage] = useState("");
  let [messageSuccess, setMessageSuccess] = useState("");
  let [file, setFile] = useState("");
  let [cntUpdate, setCntUpdate] = useState(0);
  let [cntAdd, setCntAdd] = useState(0);
  let [cntDelete, setCntDelete] = useState(0);
  let [sheetData, setData] = useState(null);
  let [productList, setProductList] = useState([]);
  let [productsAdded, setProductsAdded] = useState([]);
  let [productsUpdated, setProductsUpdated] = useState([]);
  let [productsDeleted, setProductsDeleted] = useState([]);
  function updateProducts() {
    if (productsUpdated.length == 0) return;
    setFlagLoad(true);
    axios
      .put(window.routerPrefix + "/product/updateProducts/", productsUpdated)
      .then((res) => {
        setFlagLoad(false);
        if (res.data == 0) {
          // error updating product
          message = "Error... could not update product.";
        } else {
          message = "The products updated successfully.";
        }
      })
      .catch((err) => {
        setFlagLoad(false);
        setError(err);
      });
  }
  function addProducts() {
    // Send the products to be added
    if (productsAdded.length == 0) return;
    setFlagLoad(true);
    axios
      .post(window.routerPrefix + "/product/addProducts/", productsAdded, {
        headers: {
          accept: "application/json",
          "Accept-Language": "en-US,en;q=0.8",
        },
      })
      .then((res) => {
        setFlagLoad(false);
        if (res.data == 0) {
          // error adding products
          message = "Something went wrong...";
        } else {
          let message = "The products added successfully.";
        } //else
      })
      .catch((err) => {
        message = "Error... could not add product.";
        setFlagLoad(false);
        setError(err);
      });
  }
  function getProducts() {
    setFlagLoad(true);
    axios
      .get(window.routerPrefix + "/product/products/")
      .then((res) => {
        let pList = res.data;
        setProductList(pList);
        setFlagLoad(false);
      })
      .catch((err) => {
        console.log(err);
        setFlagLoad(false);
        setError(err);
      });
  }
  function handleUploadProductSheetClick() {
    // Send the products to be updated
    updateProducts();
    addProducts();
    // deleteProducts();
    getProducts();
    // Send the products to be deleted
    setFile("");
    setFlagFileUpload(true);
  }
  function handleAnalyseSheetClick() {
    let { shopUrl } = props;
    const reader = new FileReader();
    let sheetData;
    let pList,
      productsA = [],
      productsD = [],
      productsU = [];
    setFlagLoad(true);
    reader.onload = (event) => {
      const workbook = XLSX.read(event.target.result, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      sheetData = XLSX.utils.sheet_to_json(sheet);
      console.log(sheetData);
      setData(sheetData);
      let cntU = 0,
        cntA = 0,
        cntD = 0;
      //ProductId	Name	Information	MRP	Final Price	In Stock	Rating
      sheetData.forEach((sheetProduct, index) => {
        // information may not be there
        if (!sheetProduct.information) {
          sheetProduct.information = "";
        }
        if (sheetProduct.instock == "Yes") {
          sheetProduct.instock = 1;
        } else {
          sheetProduct.instock = 0;
        }
        let unitList = [
          { unitId: 1, name: "Number" },
          { unitId: 2, name: "Multiple of 250 gm" },
          { unitId: 3, name: "Multiple of 1 kg" },
          { unitId: 4, name: "Multiple of 500 gm" },
          { unitId: 5, name: "Multiple of 1 kg" },
        ];
        for (let i = 0; i < unitList.length; i++) {
          if (sheetProduct.unit == unitList[i].name) {
            sheetProduct.unitId = unitList[i].unitId;
            delete sheetProduct.unit;
            break;
          }
        } //for
        if (!sheetProduct.productId) {
          cntA++;
          //add default values;
          sheetProduct.searchWords = "";
          sheetProduct.image = "no.jpg";
          sheetProduct.nameMarathi = "";
          productsA.push(sheetProduct);
        }
      });
      // check for no-id
      if (cntA == sheetData.length) {
        console.log("Sorry...At least one product should have ID");
        setMessage("Sorry...products without ID");
        setFlagLoad(false);
        return;
      }
      // check for wrong-id
      let flag, i;
      // Get current product-list
      axios
        .get(window.routerPrefix + "/product/products/" + shopUrl)
        .then((res) => {
          pList = res.data;
          setProductList(pList);
          //Find product with invalid id
          //Check whether any product is missing
          pList.forEach((product, index) => {
            flag = false;
            for (i = 0; i < sheetData.length; i++) {
              if (product.productId == sheetData[i].productId) {
                flag = true; //found
                break;
              } //if
            } //for
            if (!flag) {
              // not found
              // console.log("Products Mismatch.. Use latest downloaded file...");
              setMessage("Products Mismatch.. Use latest downloaded file...");
              setFlagLoad(false);
              return;
              // cntD++;
              // productsD.push(product);
            }
          });
          //Check for updated products

          sheetData.forEach((sheetProduct, index) => {
            flag = false;
            for (i = 0; i < pList.length; i++) {
              if (sheetProduct.productId == pList[i].productId) {
                flag = true; //found
                if (compareAllValues(pList[i], sheetProduct)) {
                  productsU.push(sheetProduct);
                  cntU++;
                }
                break;
              } //if
            } //for
            if (!flag && sheetProduct.productId) {
              // not found
              setMessage("Adding new product with ID...");
              setFlagLoad(false);
              return;
            }
          });
          setCntUpdate(cntU);
          setCntAdd(cntA);

          setProductsAdded(productsA);
          setProductsUpdated(productsU);
          setFlagSheetAnalysed(true);
          setFlagLoad(false);
        })
        .catch((err) => {
          console.log(err);
          setFlagLoad(false);
          setError(err);
        });
    };
    reader.readAsBinaryString(file);
  }
  function compareAllValues(product, sheetProduct) {
    //ProductId	Name	Information	MRP	Final Price	In Stock	Rating
    if (product.mrp != sheetProduct.mrp) {
      console.log("1");
      return true;
    }
    if (product.finalPrice != sheetProduct.finalPrice) {
      console.log("2");
      return true;
    }
    if (product.information != sheetProduct.information) {
      console.log(
        "3..." + product.information.length + sheetProduct.information.length
      );
      return true;
    }
    if (product.name != sheetProduct.name) {
      console.log("4");
      return true;
    }
    if (product.instock != sheetProduct.instock) {
      console.log("5");
      return true;
    }
    if (product.rating != sheetProduct.rating) {
      console.log("6");
      return true;
    }
    if (product.unit != sheetProduct.unit) {
      console.log("7");
      return true;
    }
    return false;
  }
  function fileChangedHandler(event) {
    event.preventDefault();
    let file = event.target.files[0];
    setMessage("");
    setFile("");
    setFlagSheetAnalysed(false);
    setFlagSummaryChecked(false);
    if (!file) {
      return;
    }
    //spreadsheet
    if (file.type.indexOf("csv") == -1) {
      setMessage("Invalid file...");
      return;
    }
    if (file.size > 20000) {
      setMessage("File-size should be below 20kb");
      return;
    }
    setMessage("");
    setFile(file);
    setFlagFileSelect(true);
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
  function handleSummaryCheckClick(event) {
    setFlagSummaryChecked(event.target.checked);
  }
  let { colorScheme } = props;
  // if (flagLoad) {
  //   return (
  //     <div className="col-12 text-center mt-5">
  //       <BeatLoader size={16} color={colorScheme} flagLoad />;
  //     </div>
  //   );
  // }
  return (
    <div className="row justify-content-center">
      {!flagFileUpload && (
        <div className="col-12 text-center mb-2">
          <input type="file" name="file" onChange={fileChangedHandler} />
        </div>
      )}
      {flagLoad && (
        <div className="col-12 text-center mt-5">
          <BeatLoader size={16} color={colorScheme} flagLoad />;
        </div>
      )}
      {!message && file && !flagSheetAnalysed && (
        <div className="col-12 text-center mt-4">
          <button
            className={"btn-my" + colorScheme}
            onClick={handleAnalyseSheetClick}
          >
            Analyse Selected Sheet
          </button>
        </div>
      )}
      {message && (
        <div className="col-12 text-center text-red mt-4">{message}</div>
      )}
      {flagFileUpload && (
        <div className="col-12 text-center text-red mt-4">
          Update/Add Operations Successful !
        </div>
      )}
      {!message &&
        file &&
        flagSheetAnalysed &&
        (cntAdd != 0 || cntUpdate != 0) && (
          <div className="col-12 text-center mt-4">
            <input
              type="checkbox"
              name="summaryChecked"
              id=""
              onClick={handleSummaryCheckClick}
            />{" "}
            Summary Checked
          </div>
        )}
      {!message && file && flagSummaryChecked && !flagFileUpload && (
        <div className="col-12 text-center mt-4">
          <button
            className={"btn-my" + colorScheme}
            onClick={handleUploadProductSheetClick}
          >
            Upload Product Sheet
          </button>
        </div>
      )}
      {!message && file && flagSheetAnalysed && !flagSummaryChecked && (
        <div className="row justify-content-center text-center bigger-text">
          <div className="col-12 text-thick text-bigger text-center mt-4">
            Summary of Uploaded Product-Sheet
          </div>
          <div className={"col-8 col-md-7 p-2 my-2 bg-my" + colorScheme}>
            Updations: {cntUpdate}
          </div>
          {cntUpdate != 0 &&
            productsUpdated.map((p, index) => (
              <div className="col-8 ml-auto text-left my-2" key={index}>
                {index + 1}. {p.name}
              </div>
            ))}
          <div className="col-8 col-md-7 p-2 my-2 bg-myblack text-mywhite">
            Additions: {cntAdd}
          </div>
          {cntAdd != 0 &&
            productsAdded.map((p, index) => (
              <div className="col-8 ml-auto text-left my-2" key={index}>
                {index + 1}. {p.name}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
