import AdminCategories from "./AdminCategories";
import AdminCustomers from "./AdminCustomers";
import AdminProducts from "./AdminProducts";
import AdminReportActivities from "./AdminReportActivities";
import AdminRoles from "./AdminRoles";
import AdminUsers from "./AdminUsers";

export default function ContentPage(props) {
  let { selectedEntity } = props;
  let { flagToggleButton } = props;
  return (
    <>
      {selectedEntity.isReady == false && (
        <h5 className="text-center">Work in Progress !</h5>
      )}
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
      {selectedEntity.name == "Product Categories" && (
        <AdminCategories
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
      {selectedEntity.name == "Activity Report" && (
        <AdminReportActivities
          selectedEntity={selectedEntity}
          flagToggleButton={flagToggleButton}
        />
      )}
    </>
  );
}
