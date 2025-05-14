export default function ABillHeader(props) {
  let { bill } = props;
  function getDate(date) {
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    // This arrangement can be altered based on how we want the date's format to appear.
    let currentDate = `${day}-${month}-${year}`;
    return currentDate; // "17-6-2022"
  }
  return (
    // row starts
    <>
      <div className="text-center  fw-bold">|| Shree ||</div>
      <div className="text-center biggest-text fw-bold">Laxmi Fruit Stall</div>
      <div className="text-center bigger-text fw-bold">
        220, Market Yard, Pune-411009{" "}
      </div>
      <div className="text-end">
        Date: {getDate(bill.date)}
        {/* Date: {bill.date.getDate()}/{bill.date.getMonth()}/
        {bill.date.getFullYear()} */}
        {/* {bill.date} */}
      </div>
      <div className="fw-bold">Bill No. {bill.billNumber}</div>
      <div className="text-center mb-3 border-bottom border-3 border-black">
        Customer Name: {bill.customer}
      </div>
    </>
  );
}
