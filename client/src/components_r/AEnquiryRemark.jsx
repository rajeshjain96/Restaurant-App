import { formatToIST } from "../utilities";

export default function AEnquiryRemark(props) {
  let { enquiryRemark } = props;
  let { shownIndex } = props;
  function handleDeleteButtonClick() {
    props.onDeleteButtonClick(shownIndex);
  }
  return (
    <div className="row border border-2 rounded my-2 p-2 align-items-center">
      <div className="col-8">
        <div className="text-bigger lh-1">{enquiryRemark.remark}</div>
        <div className="text-small text-italic mb-1">
          {enquiryRemark.user} ({formatToIST(enquiryRemark.addDate)})
        </div>
      </div>
      <div className="col-1">
        {" "}
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
    </div>
  );
}
