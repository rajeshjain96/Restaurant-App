import { useState } from "react";
import AdminProduct from "./AdminProduct";
import AdminProductForm from "./AdminProductForm";
import { BeatLoader } from "react-spinners";
import AdminProductFormFireBase from "./AdminProductFormFirebase";
import { deleteBackendProduct } from "./FirebaseProductService";
// import AdminProductFormSample from "./AdminProductFormSample";

function AdminProducts(props) {
  let [adminSelectedProduct, setAdminSelectedProduct] = useState("");
  let [whichForm, setwhichForm] = useState("axios");
  let [flagLoader, setFlagLoader] = useState(false);
  let { adminView } = props;
  let { filteredProductList } = props;
  useState(() => {
    let wf = window.localStorage.getItem("form");
    setwhichForm(wf);
  }, []);
  function handleEditProductButtonClick(product) {
    setAdminSelectedProduct(product);
    props.onEditProductButtonClick();
  }

  function handleProductListClick() {
    props.onProductListClick();
  }
  function handleProductEditFormSubmit(product) {
    props.onProductEditFormSubmit(product);
  }
  function handleProductAddFormSubmit(product) {
    props.onProductAddFormSubmit(product);
  }
  function handleDeleteProductButtonClick(product) {
    let ans = window.confirm(
      "Do you really want to delete the product - " + product.name
    );
    if (!ans) {
      props.showMessage(`Delete operation (${product.name}) is cancelled`);
    } else {
      deleteProduct(product);
    }
  }
  async function deleteProduct(product) {
    setFlagLoader(true);
    // let response = await axios.delete(
    //   "http://localhost:3000/fruits/" + product.id
    // );
    // let data = await response.data;
    // await deleteDoc(doc(db, "products", product.id));
    await deleteBackendProduct(product.id);
    setFlagLoader(false);
    // console.log(data);
    props.showMessage(`${product.name} 
      - deleted successfully`);
    props.onDeleteProduct(product);
  }
  function handleAddProductClick() {
    props.onAddProductClick();
  }
  if (flagLoader) {
    return <BeatLoader size={24} color={"red"} />;
  }
  return (
    <>
      {adminView == "list" && (
        <div>
          {" "}
          <a href="#" onClick={handleAddProductClick}>
            Add a product
          </a>
        </div>
      )}
      {adminView == "list" && (
        <div className="row align-items-end  p-4">
          {filteredProductList.length != 0 &&
            filteredProductList.map((product, index) => (
              <AdminProduct
                key={product.id}
                product={product}
                onEditProductButtonClick={handleEditProductButtonClick}
                onDeleteProductButtonClick={handleDeleteProductButtonClick}
              />
            ))}
        </div>
      )}
      {/* {(adminView == "edit" || adminView == "add") && whichForm == "old" && (
        <AdminProductForm
          product={adminSelectedProduct}
          onProductListClick={handleProductListClick}
          onProductEditFormSubmit={handleProductEditFormSubmit}
          onProductAddFormSubmit={handleProductAddFormSubmit}
          adminView={adminView}
          sampleProduct={filteredProductList[0]}
        />
      )} */}
      {(adminView == "edit" || adminView == "add") && (
        <AdminProductFormFireBase
          product={adminSelectedProduct}
          onProductListClick={handleProductListClick}
          onProductEditFormSubmit={handleProductEditFormSubmit}
          onProductAddFormSubmit={handleProductAddFormSubmit}
          adminView={adminView}
          sampleProduct={filteredProductList[0]}
        />
      )}
      {(adminView == "edit" || adminView == "add") && whichForm == "axios" && (
        <AdminProductForm
          product={adminSelectedProduct}
          onProductListClick={handleProductListClick}
          onProductEditFormSubmit={handleProductEditFormSubmit}
          onProductAddFormSubmit={handleProductAddFormSubmit}
          adminView={adminView}
          sampleProduct={filteredProductList[0]}
        />
      )}
    </>
  );
}
export default AdminProducts;
