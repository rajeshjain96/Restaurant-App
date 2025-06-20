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
  return formatted.replace(",", "").replace(/\//g, "-");
}
export { formatToIST };
