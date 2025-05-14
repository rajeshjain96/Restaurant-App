export default function BillHeader(props) {
  let { product } = props;
  let { user } = props;
  function getDate() {
    const date = new Date();
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
      <div className="text-end">Date: {getDate()}</div>
      <div className="text-center mb-3 border-bottom border-3 border-black">Customer Name: {user.name}</div>
    </>
  );
}
