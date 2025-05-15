import AdminCustomers from "./AdminCustomers";
import AdminProducts from "./AdminProducts";

export default function ContentPage(props) {
  let { selectedEntity } = props;
  let { flagToggleButton } = props;
  return (
    <>
      {selectedEntity.name == "Products" && (
        <AdminProducts
          selectedEntity={selectedEntity}
          flagToggleButton={flagToggleButton}
        />
      )}
      {selectedEntity.name == "Customers" && (
        <AdminCustomers
          selectedEntity={selectedEntity}
          flagToggleButton={flagToggleButton}
        />
      )}
    </>
  );
}
