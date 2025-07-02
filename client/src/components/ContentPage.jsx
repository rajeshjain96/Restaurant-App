import AdminCategories from "./AdminCategories";
import AdminCustomers from "./AdminCustomers";
import AdminEnquiries from "./AdminEnquiries";
import AdminProducts from "./AdminProducts";
import AdminQuotations from "./AdminQuotations";
import AdminReportActivities from "./AdminReportActivities";
import AdminRoles from "./AdminRoles";
import AdminUsers from "./AdminUsers";

export default function ContentPage(props) {
  let { selectedEntity } = props;
  let { flagToggleButton } = props;
  let { user } = props;
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
      {selectedEntity.name == "Enquiries" && (
        <AdminEnquiries
          selectedEntity={selectedEntity}
          flagToggleButton={flagToggleButton}
          user={user}
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
          user={user}
        />
      )}
      {selectedEntity.name == "Quotations" && (
        <AdminQuotations
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
