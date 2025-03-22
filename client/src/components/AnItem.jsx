export default function AnItem(props) {
  let { item } = props;
  let { index } = props;
  let { attributes } = props;
  let { selectedEntity } = props;
  function handleEditButtonClick() {
    props.onEditButtonClick(item);
  }

  function handleDeleteButtonClick() {
    props.onDeleteButtonClick(item);
  }
  function getNameFromId(id, index) {
    
    let obj = selectedEntity.attributes[index].optionList.find(
      (e, i) => e._id == id
    );
    
    return obj.name;
  }
  return (
    <div className="row my-2 mx-auto border border-2 border-secondary p-1">
      <div className="col-1">{index + 1}.</div>
      {attributes.map(
        (e, index) =>
          e.showInList && (
            <div key={index} className="col-2">
              {e.type != "dropdown" ? item[e.id] : getNameFromId(item[e.id], index)}
            </div>
          )
      )}

      <div className="col-1">
        <button className="btn btn-primary" onClick={handleEditButtonClick}>
          <i className="bi bi-pencil-square"></i>
        </button>
      </div>
      <div className="col-1">
        <button className="btn btn-danger" onClick={handleDeleteButtonClick}>
          <i className="bi bi-trash3-fill"></i>
        </button>
      </div>
    </div>
  );
}
