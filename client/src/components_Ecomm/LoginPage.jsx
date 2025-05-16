import axios from "axios";
import { useState } from "react";
import { getUsersFromBackeend } from "./FirebaseUserService";
import { BeatLoader } from "react-spinners";
function LoginPage(props) {
  let [loginStatus, setLoginStatus] = useState("no");
  let [loadFlag, setLoadFlag] = useState(false);
  let { user } = props;
  let { view } = props;
  function handleLoginFormSubmit(event) {
    event.preventDefault();
    let formData = new FormData(event.target);
    let user = {};
    for (let data of formData) {
      user[data[0]] = data[1];
    }
    checkUser(user);
  }
  async function checkUser(user) {
    setLoadFlag(true);
    let response = await axios("http://localhost:3000/users");
    let data = await response.data;

    // let data = await getUsersFromBackeend();
    let filteredData = data.filter(
      (e, index) => e.emailid == user.emailid && e.password == user.password
    );
    if (filteredData.length == 1) {
      setLoginStatus("success");
      props.onLoginSuccess(filteredData[0]);
    } else {
      setLoginStatus("failed");
    }
    setLoadFlag(false);
  }
  function handleCancelLoginClick() {
    props.onCancelLoginClick();
  }
  if (loadFlag) {
    return (
      <div className="my-5">
        <BeatLoader size={24} color={"blue"} />
      </div>
    );
  }
  return (
    <>
      {loginStatus == "failed" && (
        <div className="text-center text-danger">
          Wrong Credentials. Try again.
        </div>
      )}
      {view == "cartClickWithoutLogin" && (
        <div className="text-center text-danger">
          To process the order, you need to login.
        </div>
      )}
      {(loginStatus == "failed" || loginStatus == "no") && (
        <div className="row justify-content-center">
          <div className="text-center text-danger my-3">LOGIN</div>
          <div className="col-sm-12 col-md-6  border border-3 border-danger">
            <form
              className="loginForm"
              onSubmit={(event) => {
                handleLoginFormSubmit(event);
              }}
            >
              <div className="row p-3">
                <div className="col-4 col-md-6  my-2 text-end">Email-id</div>
                <div className="col-8 col-md-6 my-2">
                  <input type="email" name="emailid" id="" required />
                </div>
                <div className="col-4 col-md-6   my-2 text-end">Password</div>
                <div className="col-8 col-md-6 my-2">
                  <input
                    type="password"
                    name="password"
                    id=""
                    maxLength="10"
                    minLength="5"
                  />
                </div>

                <div className="offset-4 offset-md-6 col-8 col-md-6 my-2 ">
                  <input className="btn btn-danger" type="submit" value="Ok" />{" "}
                  <button
                    className="btn btn-danger"
                    onClick={handleCancelLoginClick}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* row ends */}
    </>
  );
}

export default LoginPage;
