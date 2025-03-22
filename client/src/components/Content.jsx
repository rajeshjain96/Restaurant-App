import { useEffect, useState } from "react";
import AddEditForm from "./addEditForm";
import AnItem from "./AnItem";
import CommonUtilityBar from "./CommonUtilityBar";

export default function Content(props) {
  // let { categoryList } = props;
  let { selectedEntity } = props;
  let { selectedEntityIndex } = props;
  let { requiredLists } = props;
  let { itemToBeEdited } = props;
  let { formData } = props;
  let { emptyEntityObject } = props;
  let { emptyValidationsArray } = props;
  let { selectedList } = props;
  let { action } = props;
  let { message } = props;
  let { sortedField } = props;
  let { direction } = props;
  // let [attributes, setAttributes] = useState("");
  useEffect(() => {
    // let a = props.selectedEntity.attributes.map((e, index) => {
    //   if (index < 4) {
    //     e.selected = true;
    //   } else {
    //     e.selected = false;
    //   }
    //   return e;
    // });
    // setAttributes(a);
  }, []);
  function handleSubmit(obj) {
    props.onSubmit(obj);
  }
  function handleFormCloseClick() {
    props.onFormCloseClick();
  }
  function handleListClick() {
    props.onListClick();
  }
  function handleAddEntityClick() {
    props.onAddEntityClick();
  }
  function handleEditButtonClick(item) {
    props.onEditButtonClick(item);
  }
  function handleDeleteButtonClick(item) {
    props.onDeleteButtonClick(item);
  }
  function handleListCheckBoxClick(checked, index) {
    props.onListCheckBoxClick(checked, index);
  }
  function handleHeaderClick(index) {
    props.onHeaderClick(index);
  }
  function handleFormTextChangeValidations(message, index) {
    props.onFormTextChangeValidations(message, index);
  }
  return (
    <>
      <CommonUtilityBar
        action={action}
        message={message}
        onListClick={handleListClick}
        onAddEntityClick={handleAddEntityClick}
      />

      {(action == "add" || action == "edit") && (
        <div className="row">
          <AddEditForm
            // attributes={selectedEntity.attributes}
            selectedEntity={selectedEntity}
            formData={formData}
            emptyEntityObject={emptyEntityObject}
            emptyValidationsArray={emptyValidationsArray}
            itemToBeEdited={itemToBeEdited}
            action={action}
            requiredLists={requiredLists}
            onSubmit={handleSubmit}
            onFormCloseClick={handleFormCloseClick}
            handleFormTextChangeValidations={handleFormTextChangeValidations}
          />
        </div>
      )}
      {action == "list" && (
        <div className="row my-2 mx-auto border border-2 border-secondary p-1">
          {[
            ...Array(
              selectedEntity.attributes.length > 4
                ? 4
                : selectedEntity.attributes.length
            ),
          ].map((e, index) => (
            <div className="col-2" key={index}>
              <input
                type="checkbox"
                name=""
                id=""
                checked={selectedEntity.attributes[index].showInList}
                onChange={(e) => {
                  handleListCheckBoxClick(e.target.checked, index);
                }}
              />{" "}
              {selectedEntity.attributes[index].label}
            </div>
          ))}
        </div>
      )}
      {action == "list" && (
        <div className="row my-2 mx-auto  p-1">
          <div className="col-1">Sr.No.</div>
          {[
            ...Array(
              selectedEntity.attributes.length > 4
                ? 4
                : selectedEntity.attributes.length
            ),
          ].map(
            (e, index) =>
              selectedEntity.attributes[index].showInList && (
                <div className={"col-2 "} key={index}>
                  <a
                    href="#"
                    className={
                      sortedField == selectedEntity.attributes[index].id
                        ? " text-large text-danger"
                        : ""
                    }
                    onClick={() => {
                      handleHeaderClick(index);
                    }}
                  >
                    {selectedEntity.attributes[index].label}{" "}
                    {sortedField == selectedEntity.attributes[index].id &&
                      direction && <i className="bi bi-arrow-down"></i>}
                    {sortedField == selectedEntity.attributes[index].id &&
                      !direction && <i className="bi bi-arrow-up"></i>}
                  </a>
                </div>
              )
          )}
        </div>
      )}

      {action == "list" &&
        selectedList.map((e, index) => (
          <AnItem
            item={e}
            key={index + 1}
            index={index}
            selectedEntity={selectedEntity}
            attributes={selectedEntity.attributes}
            onEditButtonClick={handleEditButtonClick}
            onDeleteButtonClick={handleDeleteButtonClick}
          />
        ))}
    </>
  );
}
