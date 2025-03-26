export default function CommonUtilityBar(props) {
  let { action } = props;
  let { message } = props;
  let { listLength } = props;

  function handleListClick() {
    props.onListClick();
  }
  function handleAddEntityClick() {
    props.onAddEntityClick();
  }
  function handleSearchKeyUp(event) {
    props.onSearchKeyUp(event);
  }
  return (
    <>
      {action == "list" && (
        <div className="row w-75 mx-auto justify-content-center text-start p-3 align-items-center">
          <div
            className="col-1"
            style={{ fontSize: "40px" }}
            onClick={handleAddEntityClick}
          >
            <i className="bi bi-file-plus-fill"></i>
          </div>

          {listLength != 0 && (
            <div className="col-8 text-center">
              <input
                type="search"
                name=""
                id=""
                size="50"
                onKeyUp={handleSearchKeyUp}
                onChange={handleSearchKeyUp}
                className="p-2"
              />
            </div>
          )}
          {listLength != 0 && (
            <div className="col-2 text-end">
              <select name="" id="">
                <option value="10">10</option>
                <option value="10">20</option>
                <option value="10">50</option>
                <option value="10">100</option>
              </select>
            </div>
          )}
        </div>
      )}
      {(action == "add" || action == "edit") && (
        <div className="row w-75 mx-auto justify-content-center text-start p-3 align-items-center">
          <div className="col-2" style={{ fontSize: "40px" }}>
            <button className="btn btn-primary" onClick={handleListClick}>
              <i className="bi bi-list-columns-reverse"></i>
            </button>
          </div>
        </div>
      )}
      {message && (
        <div className="message text-danger text-small text-center">
          {message}
        </div>
      )}
    </>
  );
}
