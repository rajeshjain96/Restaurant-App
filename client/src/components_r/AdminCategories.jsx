import { useEffect, useState } from "react";
import CommonUtilityBar from "./CommonUtilityBar";
import AdminCategoryForm from "./AdminCategoryForm";
import { BeatLoader } from "react-spinners";
import ACategory from "./ACategory";
import axios from "axios";

export default function AdminCategories(props) {
  let [categoryList, setCategoryList] = useState([]);
  let [action, setAction] = useState("list");
  let [filteredCategoryList, setFilteredCategoryList] = useState([]);
  let [categoryToBeEdited, setCategoryToBeEdited] = useState("");
  let [loadFlag, setLoadFlag] = useState(false);
  let [message, setMessage] = useState("");
  let [searchText, setSearchText] = useState("");
  let [sortedField, setSortedField] = useState("");
  let [direction, setDirection] = useState("");
  let { selectedEntity } = props;
  let { flagFormInvalid } = props;
  let categorySchema = [
    { attribute: "name" },
    { attribute: "info" },
    { attribute: "rating" },
    { attribute: "imageName" },
  ];
  let categoryValidations = {
    name: { message: "", mxLen: 80, mnLen: 4, onlyDigits: false },
    info: { message: "", onlyDigits: false },
    rating: {
      message: "",
      mxLen: 30,
      mnLen: 2,
      onlyDigits: false,
    },
    imageName: { message: "" },
  };
  let [showInList, setShowInList] = useState(getListFromCategorySchema());
  let [emptyCategory, setEmptyCategory] = useState(getEmptyCategory());

  function getListFromCategorySchema() {
    let list = [];
    let cnt = 0;
    categorySchema.forEach((e, index) => {
      let obj = {};
      if (!e.type) {
        // do not show id of relational data.
        obj["attribute"] = e.attribute;
        if (cnt < 4) {
          obj["show"] = true;
        } else {
          obj["show"] = false;
        }
        cnt++;
        list.push(obj);
      }
    });
    return list;
  }
  function getEmptyCategory() {
    let eCategory = {};
    categorySchema.forEach((e, index) => {
      eCategory[e["attribute"]] = "";
    });
    return eCategory;
  }
  useEffect(() => {
    getData();
  }, []);
  async function getData() {
    setLoadFlag(true);
    let response = await axios(import.meta.env.VITE_API_URL + "/categories");
    let list = await response.data;
    setCategoryList(list);
    setFilteredCategoryList(list);
    setLoadFlag(false);
  }
  async function handleFormSubmit(category) {
    let message;
    // now remove relational data
    let categoryForBackEnd = { ...category };
    for (let key in categoryForBackEnd) {
      categoryList.forEach((e, index) => {
        if (key == e.attribute && e.relationalData) {
          delete categoryForBackEnd[key];
        }
      });
    }
    if (action == "add") {
      // category = await addCategoryToBackend(category);
      let response = await axios.post(
        import.meta.env.VITE_API_URL + "/categories",
        categoryForBackEnd
      );
      category._id = await response.data.insertedId;
      message = "Category added successfully";
      // update the category list now.
      let prList = [...categoryList];
      prList.push(category);
      setCategoryList(prList);

      let fprList = [...filteredCategoryList];
      fprList.push(category);
      setFilteredCategoryList(fprList);
    } else if (action == "update") {
      category._id = categoryToBeEdited._id; // The form does not have id field
      // await updateBackendCategory(category);
      let response = await axios.put(
        import.meta.env.VITE_API_URL + "/categories",
        categoryForBackEnd
      );
      let r = await response.data;
      message = "Category Updated successfully";
      // update the category list now.
      let prList = categoryList.map((e, index) => {
        if (e._id == category._id) return category;
        return e;
      });
      let fprList = filteredCategoryList.map((e, index) => {
        if (e._id == category._id) return category;
        return e;
      });
      setCategoryList(prList);
      setFilteredCategoryList(fprList);
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
    setAction("add");
  }
  function handleEditButtonClick(category) {
    setAction("update");
    setCategoryToBeEdited(category);
  }
  function showMessage(message) {
    setMessage(message);
    window.setTimeout(() => {
      setMessage("");
    }, 3000);
  }
  async function handleDeleteButtonClick(ans, category) {
    // await deleteBackendCategory(category.id);
    let response = await axios.delete(
      import.meta.env.VITE_API_URL + "/categories/" + category._id
    );
    let r = await response.data;
    message = `Category - ${category.name} deleted successfully.`;
    //update the category list now.
    let prList = categoryList.filter((e, index) => e._id != category._id);
    setCategoryList(prList);

    let fprList = categoryList.filter((e, index) => e._id != category._id);
    setFilteredCategoryList(fprList);
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
    if (cnt == 4 && checked) {
      showMessage("Maximum 4 fields can be selected.");
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
    let list = [...filteredCategoryList];
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
    setFilteredCategoryList(list);
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
      setFilteredCategoryList(categoryList);
      return;
    }
    let searchedCategories = [];
    // searchedCategories = filterByName(query);
    searchedCategories = filterByShowInListAttributes(query);
    setFilteredCategoryList(searchedCategories);
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
    for (let i = 0; i < categoryList.length; i++) {
      for (let j = 0; j < showInList.length; j++) {
        if (showInList[j].show) {
          let parameterName = showInList[j].attribute;
          if (
            categoryList[i][parameterName] &&
            categoryList[i][parameterName]
              .toLowerCase()
              .includes(query.toLowerCase())
          ) {
            fList.push(categoryList[i]);
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
  if (loadFlag) {
    return (
      <div className="my-5 text-center">
        <BeatLoader size={24} color={"blue"} />
      </div>
    );
  }
  return (
    <>
      <CommonUtilityBar
        action={action}
        message={message}
        selectedEntity={selectedEntity}
        onListClick={handleListClick}
        onAddEntityClick={handleAddEntityClick}
        onSearchKeyUp={handleSearchKeyUp}
      />
      {filteredCategoryList.length == 0 && categoryList.length != 0 && (
        <div className="text-center">Nothing to show</div>
      )}
      {categoryList.length == 0 && (
        <div className="text-center">List is empty</div>
      )}
      {(action == "add" || action == "update") && (
        <div className="row">
          <AdminCategoryForm
            categorySchema={categorySchema}
            categoryValidations={categoryValidations}
            emptyCategory={emptyCategory}
            selectedEntity={selectedEntity}
            categoryToBeEdited={categoryToBeEdited}
            action={action}
            flagFormInvalid={flagFormInvalid}
            onFormSubmit={handleFormSubmit}
            onFormCloseClick={handleFormCloseClick}
            onFormTextChangeValidations={handleFormTextChangeValidations}
          />
        </div>
      )}
      {action == "list" && filteredCategoryList.length != 0 && (
        <div className="row  my-2 mx-auto border border-2 border-secondary p-1">
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
      {action == "list" && filteredCategoryList.length != 0 && (
        <div className="row   my-2 mx-auto  p-1">
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
        filteredCategoryList.length != 0 &&
        filteredCategoryList.map((e, index) => (
          <ACategory
            category={e}
            key={index + 1}
            index={index}
            sortedField={sortedField}
            direction={direction}
            listSize={filteredCategoryList.length}
            selectedEntity={selectedEntity}
            showInList={showInList}
            onEditButtonClick={handleEditButtonClick}
            onDeleteButtonClick={handleDeleteButtonClick}
          />
        ))}
    </>
  );
}
