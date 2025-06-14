import axios from "axios";

export default async function recordsAddBulk(recordsToBeAdded, entity, list) {
  let result = {};
  try {
    const response = await axios.post(
      import.meta.env.VITE_API_URL + "/" + entity + "/bulk-add",
      recordsToBeAdded
    );
    // Add this to the list
    const addedRecords = response.data;
    let l = [...list];
    addedRecords.forEach((e, index) => {
      l.push(e);
    });
    result.message =
      addedRecords.length +
      (addedRecords.length == 1 ? " record" : " records") +
      " added successfully";
    result.updatedList = l;
    result.success = true;
    return result;
  } catch (error) {
    console.log(error);

    result.message("Something went wrong, refresh the page");
    result.updatedList = list;
    result.success = false;
    return result;
  }
}
