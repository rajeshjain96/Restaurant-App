import Product from "./Product";

function ProductsPage(props) {
  let { filteredProductList } = props;

  function handleAddToCartButtonClick(product) {
    props.onAddToCartButtonClick(product);
  }
  function handleChangeQtyButtonClick(product) {
    props.onChangeQtyButtonClick(product);
  }
  return (
    <>
      <div className="row align-items-end  p-4 border-bottom border-4 ">
        {filteredProductList.length != 0 &&
          filteredProductList.map((product, index) => (
            <Product
              key={product.id}
              product={product}
              onAddToCartButtonClick={handleAddToCartButtonClick}
              onChangeQtyButtonClick={handleChangeQtyButtonClick}
            />
          ))}
      </div>
    </>
  );
}

export default ProductsPage;
