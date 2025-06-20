import { formatToIST } from "../utilities";
export default function AEnquiryFile(props) {
  let { enquiryFile } = props;
  let { enquiry } = props;
  let { shownIndex } = props;
  function handleLinkCopyClick() {
    props.onLinkCopyClick(shownIndex);
  }
  function handleDeleteButtonClick() {
    props.onDeleteButtonClick(shownIndex);
  }
  return (
    <div className="row border border-2 rounded my-2 p-2 align-items-center">
      <div className="text-small my-1 col-10">
        {window.location.hostname +
          "/resources?enquiry_id=" +
          enquiry._id +
          "?index=" +
          shownIndex}{" "}
        <span
          onClick={() => {
            handleLinkCopyClick(shownIndex);
          }}
          style={{ fontSize: "20px", color: "grey" }}
        >
          <i className="fas fa-copy"></i>
        </span>
        {<span>{enquiryFile.flagClicked ? " Copied" : ""}</span>}
        {/* <i class="bi bi-clipboard-check"></i>
                        <i class="bi bi-clipboard-plus"></i>{" "} */}
      </div>
      <div className="col-1">
        <span style={{ fontSize: "20px", color: "grey" }}>
          <i className="bi bi-pencil-square"></i>
        </span>
        &nbsp;{" "}
      </div>
      <div className="col-1">
        &nbsp;{" "}
        <span
          style={{ fontSize: "20px", color: "grey" }}
          onClick={() => {
            handleDeleteButtonClick(shownIndex);
          }}
        >
          <i className="bi bi-trash3-fill"></i>
        </span>
      </div>
      <div className="col-2">
        <img
          src={
            import.meta.env.VITE_API_URL +
            "/uploadedImages/" +
            enquiryFile.enquiryFileName
          }
          className="img-fluid"
          alt=""
        />
      </div>
      <div className="col-8  lh-1">
        <div className="text-bigger">{enquiryFile.remark}</div>
        <div className="text-small text-italic mb-1">
          {enquiryFile.user} ({formatToIST(enquiryFile.addDate)})
        </div>
      </div>
    </div>
  );
}
