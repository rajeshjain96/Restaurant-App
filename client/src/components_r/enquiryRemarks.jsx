import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { BeatLoader } from "react-spinners";

export default function EnquiryRemarks() {
  const [params] = useSearchParams();
  const id = params.get("id");
  const product = params.get("product");
  const user = params.get("user");
  let [flagLoad, setFlagLoad] = useState(false);
  let [message, setMessage] = useState("");
  let [enquiry, setEnquiry] = useState([]);
  let [remark, setRemark] = useState("");
  useEffect(() => {
    getData();
  }, []);
  async function getData() {
    setFlagLoad(true);
    try {
      let response = await axios(
        import.meta.env.VITE_API_URL + "/enquiries/" + id
      );
      let enq = await response.data;
      setEnquiry(enq);
    } catch (error) {
      showMessage("Something went wrong, refresh the page");
    }
    setFlagLoad(false);
  }
  function formatToIST(dateString) {
    const options = {
      timeZone: "Asia/Kolkata", // IST
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false, // use 24-hour format
    };

    const formatted = new Date(dateString).toLocaleString("en-GB", options);

    // Convert "11/06/2024, 13:30" → "11-06-2024 13:30"
    return formatted.replace(",", "").replace(/\//g, "-");
  }
  function showMessage(message) {
    setMessage(message);
    window.setTimeout(() => {
      setMessage("");
    }, 3000);
  }
  function getDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB"); // dd/mm/yyyy
  }
  function handleWhatsappClick() {
    let message = "";
    let url =
      `https://api.whatsapp.com/send?phone=${enquiry.mobileNumber}&text=` +
      message;
    window.open(url, "_blank");
  }
  async function handleFormSubmit(event) {
    event.preventDefault();
    setFlagLoad(true);
    try {
      let response = await axios.post(
        import.meta.env.VITE_API_URL + "/enquiries/" + id + "/remarks",
        { remark: remark, user: user }
      );
      let r = await response.data;
    } catch (error) {
      showMessage("Something went wrong, refresh the page");
    }
    setFlagLoad(false);
  }
  function handleTextAreaChange(event) {
    setRemark(event.target.value);
  }
  if (flagLoad) {
    return (
      <div className="my-5 text-center">
        <BeatLoader size={24} color={"blue"} />
      </div>
    );
  }
  return (
    <>
      <div className="row fixed-top border-bottom border-1 border-primary justify-content-center">
        <div className="col-8">
          <div className="text-center">
            <span className="text-secondary">Product Interested In: </span>
            <span className="text-black">{product}</span>
          </div>
          <div className="text-center">
            <span className="text-secondary">Customer Name: </span>
            <span className="text-black">
              {enquiry.name} ({enquiry.mobileNumber})
            </span>
          </div>
          <div className="text-center">
            <span className="text-secondary">Location: </span>
            <span className="text-black">
              {enquiry.siteLocation} ({enquiry.city} - {enquiry.region}).
              <span className="text-secondary"> Start-date:</span>
              {formatToIST(enquiry.addDate)}
              {/* {enquiry.addDate} */}
            </span>
          </div>
        </div>
        <div className="col-2">
          <span onClick={handleWhatsappClick}>
            <i
              className="bi bi-whatsapp"
              style={{ fontSize: "2rem", color: "#25D366" }}
            ></i>
          </span>
        </div>
      </div>
      <div className="container enquiry-remarks">
        <form onSubmit={handleFormSubmit}>
          <div className="row">
            <div className="col-8">
              <textarea
                cols="40"
                rows="5"
                style={{ resize: "none", padding: "5px" }}
                name="remark"
                value={remark}
                id=""
                placeholder="Add remark here"
                onChange={handleTextAreaChange}
              ></textarea>
            </div>
            <div className="col-2">
              <button className="btn btn-primary" type="submit">
                Add
              </button>
            </div>
          </div>
        </form>
        <div className="container">
          {enquiry.remarks && (
            <div className="row ">
              {enquiry.remarks
                .slice()
                .reverse()
                .map((e, index) => (
                  <div key={index}>
                    <div className="text-bigger">{e.remark}</div>
                    <div className="text-small text-italic">
                      {e.user} ({formatToIST(e.addDate)})
                    </div>
                    <div></div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
