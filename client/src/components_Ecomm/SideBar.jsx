export default function SideBar(props) {
  function handleLoginButtonClick() {
    props.onLoginButtonClick();
  }
  function handleSignupButtonClick() {
    props.onSignupButtonClick();
  }
  function handleLogoutButtonClick() {
    props.onLogoutButtonClick();
  }
  function handleLogoClick() {
    props.onLogoClick();
  }
  return (
    <>
      <div className="row  justify-content-between bg-white  align-items-start fixed-top p-3 border-bottom border-3 border-danger">
        <div className="col-3">
          {" "}
          <img src="/images/shop_logo.jpg" className="img-fluid" alt="" />
        </div>
        <div className=" col-6  p-3 text-end">
          <button
            className="btn btn-secondary"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasExample"
            aria-controls="offcanvasExample"
          >
            <i className="bi bi-list"></i>
          </button>
        </div>
      </div>

      <div
        className="offcanvas offcanvas-end off"
        tabIndex="-1"
        id="offcanvasExample"
        aria-labelledby="offcanvasExampleLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="offcanvasExampleLabel"></h5>
          <button
            type="button"
            className="btn-close text-reset"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">
          <div className="my-3">
            Not registered yet?{" "}
            <a
              href="#"
              onClick={handleSignupButtonClick}
              data-bs-toggle="offcanvas"
            >
              Sign-up
            </a>
          </div>
          <div className="my-3">
            Already registered?{" "}
            <a
              href="#"
              onClick={handleLoginButtonClick}
              data-bs-toggle="offcanvas"
            >
              Log-in
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
