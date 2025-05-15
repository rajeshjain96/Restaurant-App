import AdminCustomers from "./AdminCustomers";
import AdminProducts from "./AdminProducts";
import AdminRoles from "./AdminRoles";
import AdminUsers from "./AdminUsers";

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
      {selectedEntity.name == "Users" && (
        <AdminUsers
          selectedEntity={selectedEntity}
          flagToggleButton={flagToggleButton}
        />
      )}
      {selectedEntity.name == "Roles" && (
        <AdminRoles
          selectedEntity={selectedEntity}
          flagToggleButton={flagToggleButton}
        />
      )}
    </>
  );
}
