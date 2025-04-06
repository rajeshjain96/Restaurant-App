import { useEffect, useState } from "react";
import CommonUtilityBar from "./CommonUtilityBar";
import {
  addProductToBackend,
  deleteBackendProduct,
  getProductsFromBackend,
  updateBackendProduct,
} from "./FirebaseProductService";
import AdminProductForm from "./AdminProductForm";
import AProduct from "./AProduct";

export default function AdminProducts(props) {
  // let { categoryList } = props;
  let [productList, setProductList] = useState([]);
  let [action, setAction] = useState("list");
  let [filteredProductList, setFilteredProductList] = useState([]);
  let [productToBeEdited, setProductToBeEdited] = useState("");

  let [message, setMessage] = useState("");
  let [searchText, setSearchText] = useState("");
  let [sortedField, setSortedField] = useState("");
  let [direction, setDirection] = useState("");

  let { selectedEntity } = props;
  let { requiredLists } = props;
  let { emptyEntityObject } = props;
  // let { sortedField } = props;
  let { flagFormInvalid } = props;
  let productSchema = {
    name: "",
    // category: "",
    // categoryId: -1,
    info: "",
    price: "",
    imageName: "",
    // instock: 1,
    // rating: 5,
  };
  let productValidations = {
    name: { message: "", mxLen: 80, mnLen: 4, onlyDigits: false },
    info: { message: "", onlyDigits: false },
    price: {
      message: "",
      mxLen: 30,
      mnLen: 2,
      onlyDigits: false,
    },
    imageName: { message: "" },
  };
  let [showInList, setShowInList] = useState(getListFromProductSchema());
  function getListFromProductSchema() {
    let ps = { ...productSchema };
    let list = [];
    let cnt = 0;
    for (let key in ps) {
      console.log(ps[key]);

      let obj = {};
      if (cnt < 4) {
        obj["attribute"] = key;
        obj["show"] = true;
      } else {
        obj["attribute"] = key;
        obj["show"] = false;
      }
      cnt++;
      list.push(obj);
    }
    return list;
  }
  useEffect(() => {
    getData();
  }, []);
  async function getData() {
    let list = await getProductsFromBackend();
    setProductList(list);
    setFilteredProductList(list);
  }
  async function handleFormSubmit(product) {
    let message;
    if (action == "add") {
      product.dateAdded = new Date();
      product.dateUpdated = new Date();
      product = await addProductToBackend(product);
      message = "Product added successfully";
      // update the product list now.
      let prList = [...productList];
      prList.push(product);
      setProductList(prList);

      let fprList = [...filteredProductList];
      fprList.push(product);
      setFilteredProductList(fprList);
    } else if (action == "update") {
      product.dateUpdated = new Date();
      await updateBackendProduct(product);
      message = "Product Updated successfully";
      // update the product list now.
      let prList = productList.map((e, index) => {
        if (e.id == product.id) return product;
        return e;
      });
      let fprList = filteredProductList.map((e, index) => {
        if (e.id == product.id) return product;
        return e;
      });
      setProductList(prList);
      setFilteredProductList(fprList);
    }
    showMessage(message);
    setAction("list");
  }
  function handleFormCloseClick() {
    props.onFormCloseClick();
  }
  function handleListClick() {
    setAction("list");
  }
  function handleAddEntityClick() {
    // clearPreviousData();
    setAction("add");
  }
  function handleEditButtonClick(product) {
    setAction("update");
    setProductToBeEdited(product);
  }
  function showMessage(message) {
    setMessage(message);
    window.setTimeout(() => {
      setMessage("");
    }, 3000);
  }
  async function handleDeleteButtonClick(ans, product) {
    // onDeleteButtonClick(ans, item);
    await deleteBackendProduct(product.id);
    message = `Product - ${product.name} deleted successfully.`;

    //update the product list now.
    let prList = productList.filter((e, index) => e.id != product.id);
    setProductList(prList);

    let fprList = productList.filter((e, index) => e.id != product.id);
    setFilteredProductList(fprList);
    showMessage(message);
  }
  function handleListCheckBoxClick(checked, selectedIndex) {
    // Minimum 1 field should be shown
    let cnt = 0;
    showInList.forEach((e, index) => {
      if (e.show) {
        cnt++;
      }
    });
    if (cnt == 1 && !checked) {
      showMessage("Minimum 1 field should be selected.");
      return;
    }
    let att = [...showInList];
    let a = att.map((e, index) => {
      let p = { ...e };
      if (index == selectedIndex && checked) {
        p.show = true;
      } else if (index == selectedIndex && !checked) {
        p.show = false;
      }
      return p;
    });
    // sEntity.attributes = a;
    setShowInList(a);
  }
  function handleHeaderClick(index) {
    let field = showInList[index].attribute;
    let d = false;
    if (field === sortedField) {
      // same button clicked twice
      d = !direction;
    } else {
      // different field
      d = false;
    }
    let list = [...filteredProductList];
    setDirection(d);
    if (d == false) {
      //in ascending order

      list.sort((a, b) => {
        if (a[field] > b[field]) {
          return 1;
        }
        if (a[field] < b[field]) {
          return -1;
        }
        return 0;
      });
    } else {
      //in descending order
      list.sort((a, b) => {
        if (a[field] < b[field]) {
          return 1;
        }
        if (a[field] > b[field]) {
          return -1;
        }
        return 0;
      });
    }
    setFilteredProductList(list);
    setSortedField(field);
  }
  function handleSrNoClick() {
    props.onSrNoClick();
  }
  function handleFormTextChangeValidations(message, index) {
    props.onFormTextChangeValidations(message, index);
  }
  function handleFileUploadChange(file, index) {
    props.onFileUploadChange(file, index);
  }

  function handleSearchKeyUp(event) {
    let searchText = event.target.value;
    setSearchText(searchText);
    performSearchOperation(searchText);
  }
  function performSearchOperation(searchText) {
    let query = searchText.trim();
    if (query.length == 0) {
      setFilteredProductList(productList);
      return;
    }
    let searchedProducts = [];
    // searchedProducts = filterByName(query);
    searchedProducts = filterByShowInListAttributes(query);
    setFilteredProductList(searchedProducts);
  }
  function filterByName(query) {
    let fList = [];
    // console.log(selectedEntity.attributes[0].showInList);

    for (let i = 0; i < selectedList.length; i++) {
      if (selectedList[i].name.toLowerCase().includes(query.toLowerCase())) {
        fList.push(selectedList[i]);
      }
    } //for
    return fList;
  }
  function filterByShowInListAttributes(query) {
    let fList = [];
    for (let i = 0; i < productList.length; i++) {
      for (let j = 0; j < showInList.length; j++) {
        if (showInList[j].show) {
          let parameterName = showInList[j].attribute;
          if (
            productList[i][parameterName] &&
            productList[i][parameterName]
              .toLowerCase()
              .includes(query.toLowerCase())
          ) {
            fList.push(productList[i]);
            break;
          }
        }
      } //inner for
    } //outer for
    return fList;
  }
  function handleChangeImageClick(index) {
    props.onChangeImageClick(index);
  }
  function handleChangeImageCancelClick(index) {
    props.onChangeImageCancelClick(index);
  }
  return (
    <>
      <CommonUtilityBar
        action={action}
        message={message}
        onListClick={handleListClick}
        onAddEntityClick={handleAddEntityClick}
        onSearchKeyUp={handleSearchKeyUp}
      />
      {filteredProductList.length == 0 && productList.length != 0 && (
        <div className="text-center">Nothing to show</div>
      )}
      {productList.length == 0 && (
        <div className="text-center">List is empty</div>
      )}
      {(action == "add" || action == "update") && (
        <div className="row">
          <AdminProductForm
            // attributes={selectedEntity.attributes}
            productSchema={productSchema}
            productValidations={productValidations}
            selectedEntity={selectedEntity}
            emptyEntityObject={emptyEntityObject}
            productToBeEdited={productToBeEdited}
            action={action}
            requiredLists={requiredLists}
            flagFormInvalid={flagFormInvalid}
            onFormSubmit={handleFormSubmit}
            onFormCloseClick={handleFormCloseClick}
            onFormTextChangeValidations={handleFormTextChangeValidations}
            onFileUploadChange={handleFileUploadChange}
            onChangeImageClick={handleChangeImageClick}
            onChangeImageCancelClick={handleChangeImageCancelClick}
          />
        </div>
      )}
      {action == "list" && filteredProductList.length != 0 && (
        <div className="row  my-2 mx-auto border border-2 border-secondary p-1">
          <div className="col-1">
            <a
              href="#"
              // className={
              //   sortedField == selectedEntity.attributes[index].id
              //     ? " text-large text-danger"
              //     : ""
              // }
              onClick={() => {
                handleSrNoClick();
              }}
            >
              S N.{" "}
              {sortedField == "updateDate" && direction && (
                <i className="bi bi-arrow-up"></i>
              )}
              {sortedField == "updateDate" && !direction && (
                <i className="bi bi-arrow-down"></i>
              )}
            </a>
          </div>
          {showInList.map((e, index) => (
            <div className="col-2" key={index}>
              <input
                type="checkbox"
                name=""
                id=""
                checked={showInList[index]["show"] == true}
                onChange={(e) => {
                  handleListCheckBoxClick(e.target.checked, index);
                }}
              />{" "}
              {e.attribute.charAt(0).toUpperCase() + e.attribute.slice(1)}
            </div>
          ))}
        </div>
      )}
      {action == "list" && filteredProductList.length != 0 && (
        <div className="row  my-2 mx-auto  p-1">
          <div className="col-1">
            <a
              href="#"
              onClick={() => {
                handleSrNoClick();
              }}
            >
              S N.{" "}
              {sortedField == "updateDate" && direction && (
                <i className="bi bi-arrow-up"></i>
              )}
              {sortedField == "updateDate" && !direction && (
                <i className="bi bi-arrow-down"></i>
              )}
            </a>
          </div>
          {showInList.map(
            (e, index) =>
              e.show && (
                <div className={"col-2 "} key={index}>
                  <a
                    href="#"
                    className={
                      sortedField == e.attribute
                        ? " text-large text-danger"
                        : ""
                    }
                    onClick={() => {
                      handleHeaderClick(index);
                    }}
                  >
                    {e.attribute.charAt(0).toUpperCase() + e.attribute.slice(1)}{" "}
                    {sortedField == e.attribute && direction && (
                      <i className="bi bi-arrow-up"></i>
                    )}
                    {sortedField == e.attribute && !direction && (
                      <i className="bi bi-arrow-down"></i>
                    )}
                  </a>
                </div>
              )
          )}
          <div className="col-1">&nbsp;</div>
        </div>
      )}
      {action == "list" &&
        filteredProductList.length != 0 &&
        filteredProductList.map((e, index) => (
          <AProduct
            product={e}
            key={index + 1}
            index={index}
            sortedField={sortedField}
            direction={direction}
            listSize={filteredProductList.length}
            selectedEntity={selectedEntity}
            // attributes={selectedEntity.attributes}
            showInList={showInList}
            onEditButtonClick={handleEditButtonClick}
            onDeleteButtonClick={handleDeleteButtonClick}
          />
        ))}
    </>
  );
}
