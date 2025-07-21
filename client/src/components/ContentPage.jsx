import AdminCategories from "./AdminCategories";
import AdminEnquiries from "./AdminEnquiries";
import AdminProducts from "./AdminProducts";
import AdminReportActivities from "./AdminReportActivities";
import AdminRoles from "./AdminRoles";
import AdminUsers from "./AdminUsers";

export default function ContentPage(props) {
  let { selectedEntity } = props;
  let { user } = props;
  function handleBackClick() {
    props.onBackClick();
  }
  return (
    <>
      <div className="text-center text-bigger my-3">
        <a href="#" onClick={handleBackClick}>
          BACK
        </a>
      </div>
      {selectedEntity.isReady == false && (
        <h5 className="text-center">Work in Progress !</h5>
      )}
      {selectedEntity.name == "Products" && (
        <AdminProducts selectedEntity={selectedEntity} />
      )}
      {selectedEntity.name == "Enquiries" && (
        <AdminEnquiries selectedEntity={selectedEntity} user={user} />
      )}
      {selectedEntity.name == "Product Categories" && (
        <AdminCategories selectedEntity={selectedEntity} user={user} />
      )}
      {selectedEntity.name == "Users" && (
        <AdminUsers selectedEntity={selectedEntity} />
      )}
      {selectedEntity.name == "Roles" && (
        <AdminRoles selectedEntity={selectedEntity} />
      )}
      {selectedEntity.name == "Activity Report" && (
        <AdminReportActivities selectedEntity={selectedEntity} />
      )}
    </>
  );
}
