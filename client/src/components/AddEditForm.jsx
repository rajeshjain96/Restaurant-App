import { useEffect, useState } from "react";
import "../formstyles.css";
export default function AddEditForm(props) {
  let [loadFlag, setLoadFlag] = useState(false);

  let { action } = props;
  let { itemToBeEdited } = props;
  let { selectedEntity } = props;
  const [formData, setFormData] = useState("");

  useEffect(() => {
    if (action == "add") {
      setFormData(props.formData);
    } else {
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
    } else if (type === "radio") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };
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
    console.log(e.target.optionList);
    // get corresponding id from the data
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    // for dropdown, data is to be modified
    console.log(">>>><<<<");
    console.log(formData);
    props.onSubmit(formData);
  };
  function handleFormCloseClick() {
    props.onFormCloseClick();
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
          {selectedEntity.attributes.map((field) => (
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
                    required
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
                        checked={formData[field.id] === option}
                        onChange={handleChange}
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
                    required
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
                  <input
                    className="add-form-else-ele"
                    type={field.type}
                    id={field.id}
                    // size="50"
                    name={field.id}
                    value={formData[field.id]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    required
                  />
                )}
              </div>
            </div>
          ))}
          <div className="add-form-but my-3">
            <button className="btn btn-primary mx-2" type="submit">
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
