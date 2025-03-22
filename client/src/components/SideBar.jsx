export default function SideBar(props) {
  let { entityDisplayNames } = props;
  function handleSideBarOptionClick(index) {
    
    props.onEntityClick(index);
  }
  return (
    <div className="row bg-danger text-start container-sidebar p-3">
      {entityDisplayNames.map((e, index) => (
        <div className="text-start" key={index}>
          <button
            className="btn btn-sidebar my-2 text-white"
            onClick={() => {
              handleSideBarOptionClick(index);
            }}
          >
            {e}
          </button>
        </div>
      ))}
    </div>
  );
}
