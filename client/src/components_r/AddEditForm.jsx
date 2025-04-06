import { useEffect, useState } from "react";
import fieldValidate from "./FormValidations.js";
import "../formstyles.css";
export default function AddEditForm(props) {
  let [loadFlag, setLoadFlag] = useState(false);

  let { action } = props;
  let { itemToBeEdited } = props;
  let { selectedEntity } = props;
  let { emptyValidationsArray } = props;
  let { flagFormInvalid } = props;

  const [formData, setFormData] = useState(props.emptyEntityObject);

  useEffect(() => {
    if (props.action == "add") {
      setFormData(props.emptyEntityObject);
    } else if (props.action == "edit") {
      setFormData(itemToBeEdited);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: checked,
      }));
    } else if (type === "radio" && checked) {
      // setFormData((prevData) => ({
      //   ...prevData,
      //   [name]: value,
      // }));

      setFormData({ ...formData, [name]: value });
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };
  function handleTextChange(e, index) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    let message = fieldValidate(
      e,
      selectedEntity.attributes[index].validations
    );
    props.onFormTextChangeValidations(message, index);
  }
  function handleFileChange(e, index) {
    // formData.append('image', $('input[type=file]')[0].files[0]);
    const file = e.target.files[0];

    // if (e.target.files.length > 1) {
    //   props.onFormTextChangeValidations("Only one image is required", index);
    //   return;
    // }
    if (!file) {
      props.onFormTextChangeValidations("No file selected", index);
      return;
    }
    let fileType = file.type.substring(0, file.type.indexOf("/"));
    if (fileType != "image") {
      props.onFormTextChangeValidations("Select image file", index);
      return;
      // setFile("");
    } else {
      if (action == "add") {
        setFormData({ ...formData, [e.target.name]: file.name });
      } else if (action == "edit") {
        //nothing yet
      }
      props.onFormTextChangeValidations("", index);
      props.onFileUploadChange(file, index);
    }

    // setFormData({ ...formData, [e.target.name]: filePath });
    // let message = fieldValidate(
    //   e,
    //   selectedEntity.attributes[index].validations
    // );
    // props.handleFormTextChangeValidations(message, index);
  }
  const handleCheckboxGroupChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData((prevData) => {
      const updatedValues = checked
        ? [...prevData[name], value]
        : prevData[name].filter((item) => item !== value);
      return { ...prevData, [name]: updatedValues };
    });
  };
  const handleDropdownChange = (e) => {
    // get corresponding id from the data
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    // for dropdown, data is to be modified
    props.onSubmit(formData);
  };
  function handleFormCloseClick() {
    props.onFormCloseClick();
  }
  function handleChangeImageClick(index) {
    props.onChangeImageClick(index);
  }
  function handleChangeImageCancelClick(index) {
    props.onChangeImageCancelClick(index);
  }
  if (loadFlag) {
    return <div>Wait...</div>;
  }
  return (
    //   <div className="add-form">
    <div className="">
      {/* <h2 className="heading-add-pro">Add Product</h2> */}
      <div className="add-form-ele">
        <form
          className="add-form-form row align-items-start`"
          onSubmit={handleSubmit}
        >
          {selectedEntity.attributes.map((field, field_index) => (
            <div key={field.id} className="col-6 my-1">
              <div className="my-1 text-bold">
                <label htmlFor={field.id}>{field.label}</label>
              </div>
              <div className="text-start ms-2">
                {field.type === "textarea" && (
                  <textarea
                    className="add-form-textarea"
                    id={field.id}
                    name={field.id}
                    value={formData[field.id]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    rows="4"
                  />
                )}
                {field.type === "checkbox" && (
                  <input
                    className="add-form-checkbox"
                    type="checkbox"
                    id={field.id}
                    name={field.id}
                    checked={formData[field.id]}
                    onChange={handleChange}
                  />
                )}
                {field.type === "radio" &&
                  field.options.map((option, index) => (
                    <div key={index} className="add-form-radio">
                      <input
                        type="radio"
                        id={`${field.id}-${option}`}
                        name={field.id}
                        value={option}
                        // value={formData[`${field.id}`]}
                        // value={formData[field.id]}
                        checked={formData[`${field.id}`] == option}
                        // checked={true}
                        onChange={handleChange}
                        onClick={handleChange}
                      />
                      <label htmlFor={`${field.id}-${option}`}>{option}</label>
                    </div>
                  ))}
                {field.type === "checkbox-group" &&
                  field.options.map((option, index) => (
                    <div key={index} className="add-form-checkbox-group">
                      <input
                        type="checkbox"
                        id={`${field.id}-${option}`}
                        name={field.id}
                        value={option}
                        checked={formData[field.id].includes(option)}
                        onChange={handleCheckboxGroupChange}
                      />
                      <label htmlFor={`${field.id}-${option}`}>{option}</label>
                    </div>
                  ))}{" "}
                {field.type === "dropdown" && (
                  <select
                    className="add-form-dropdown"
                    id={field.id}
                    name={field.id}
                    value={formData[field.id]}
                    onChange={handleDropdownChange}
                  >
                    <option value="">Select an option</option>
                    {field.optionList.map((option, index) => (
                      <option key={index} value={option._id}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                )}
                {(field.type === "text" || field.type === "number") && (
                  <>
                    <input
                      className="add-form-else-ele"
                      type={field.type}
                      id={field.id}
                      // size="50"
                      name={field.id}
                      value={formData[field.id]}
                      onChange={(e) => {
                        handleTextChange(e, field_index);
                      }}
                      placeholder={field.placeholder}
                    />
                    {emptyValidationsArray[field_index].message && (
                      <div className="text-danger">
                        {emptyValidationsArray[field_index].message}
                      </div>
                    )}
                  </>
                )}
                {field.type === "file" && (
                  <>
                    {/* in edit mode, show image */}
                    {action == "edit" && !field.flagChangeImage && (
                      <div>
                        <img
                          className="col-3 my-2"
                          src={
                            "http://localhost:3000/uploadedImages/" +
                            formData[field.id]
                          }
                          alt="No image"
                        />
                      </div>
                    )}
                    {/* add mode */}
                    {action == "edit" && !field.flagChangeImage && (
                      <div>{formData[field.id]} </div>
                    )}
                    {action == "edit" && (
                      <div className="my-2">
                        {!field.flagChangeImage && (
                          <button
                            className="btn btn-secondary"
                            type="button"
                            /*When a button is placed inside an HTML form, it will, by default, submit the form unless its type attribute is explicitly set to "button". To prevent a button from submitting a form, you can use one of the following approaches: Set the type attribute to "button". */
                            onClick={() => {
                              handleChangeImageClick(field_index);
                            }}
                          >
                            Change Image
                          </button>
                        )}
                      </div>
                    )}

                    {(action == "add" ||
                      (action == "edit" && field.flagChangeImage)) && (
                      <input
                        // className="add-form-else-ele"
                        type={field.type}
                        id={field.id}
                        // size="50"
                        name={field.id}
                        // value={formData[field.id]}
                        onChange={(e) => {
                          handleFileChange(e, field_index);
                        }}
                      />
                    )}
                    {field.flagChangeImage && (
                      <button
                        className="btn btn-secondary mx-1"
                        onClick={() => {
                          handleChangeImageCancelClick(field_index);
                        }}
                        type="button"
                      >
                        Cancel
                      </button>
                    )}
                    {emptyValidationsArray[field_index].message && (
                      <div className="text-danger">
                        {emptyValidationsArray[field_index].message}
                      </div>
                    )}
                    {/* https://codebuff.hashnode.dev/how-to-upload-display-and-save-images-using-nodejs-and-react */}

                    {(action == "add" ||
                      (action == "edit" &&
                        field.flagChangeImage &&
                        field.preview)) && (
                      <div>
                        <img
                          className="col-3 my-2"
                          src={field.preview}
                          alt=""
                        />
                      </div>
                    )}
                    {action == "add" ||
                      (action == "edit" &&
                        field.flagChangeImage &&
                        field.size && (
                          <div>
                            {(field.size / (1024 * 1024)).toFixed(2)} MB{" "}
                          </div>
                        ))}
                  </>
                )}
              </div>
            </div>
          ))}
          <div className="add-form-but my-3">
            <button className="btn btn-primary mx-2 " type="submit">
              {action == "add" ? "ADD " : "UPDATE "} {selectedEntity.btnLabel}
            </button>
            <button
              className="btn btn-secondary"
              type="button"
              onClick={handleFormCloseClick}
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
