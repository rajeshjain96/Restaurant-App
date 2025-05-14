import axios from "axios";
import { useState } from "react";
import { addUserToBackend, getUsersFromBackeend } from "./FirebaseUserService";
import { BeatLoader } from "react-spinners";

function SignupPage(props) {
  let [signupStatus, setSignupStatus] = useState("no");
  let [message, setMessage] = useState("");
  let [loadFlag, setLoadFlag] = useState(false);

  function handleSignupFormSubmit(event) {
    event.preventDefault();
    let formData = new FormData(event.target);
    let user = {};
    for (let data of formData) {
      user[data[0]] = data[1];
    } //for
    user["role"] = "user";
    console.log(user);
    checkUserExists(user);
  }
  async function checkUserExists(user) {
    let response = await axios("http://localhost:3000/users");
    let data = await response.data;
    setLoadFlag(true);
    // let data = await getUsersFromBackeend();
    let filteredData = data.filter((e, index) => e.emailid == user.emailid);
    if (filteredData.length >= 1) {
      console.log("Already exists");
      setSignupStatus("failed");
      setMessage("Sorry... This email-id is already registered.");
    } else {
      console.log("New user");
      await addUser(user);
    }
    setLoadFlag(false);
  }
  async function addUser(user) {
    let response = await axios.post("http://localhost:3000/users", user);
    // await addUserToBackend(user);
    setSignupStatus("success");
  }
  function handleLoginClick() {
    props.onLoginButtonClick();
  }
  if (loadFlag) {
    return (
      <div className="my-5">
        <BeatLoader size={24} color={"red"} />
      </div>
    );
  }
  return (
    <>
      {signupStatus == "success" && (
        <div className="text-center text-danger">
          Signed up successfully. You may{" "}
          <a href="#" onClick={handleLoginClick}>
            login
          </a>{" "}
          now.
        </div>
      )}
      {signupStatus == "failed" && (
        <div className="text-center text-danger">
          Sorry... This email-id is already registered.
        </div>
      )}
      {(signupStatus == "no" || signupStatus == "failed") && (
        <div className="p-4">
          <div className="text-center text-danger my-3">SIGNUP</div>
          <div className="row justify-content-center">
            <div className="col-sm-12 col-md-6  border border-3 border-danger">
              <form
                className="loginForm"
                onSubmit={(event) => {
                  handleSignupFormSubmit(event);
                }}
              >
                <div className="row p-3">
                  <div className="col-4 col-md-6 my-2 text-end">Name</div>
                  <div className="col-8 col-md-6 my-2">
                    <input type="text" name="name" id="" required />
                  </div>
                  <div className="col-4 col-md-6 my-2 text-end">Email-id</div>
                  <div className="col-8 col-md-6 my-2">
                    <input type="email" name="emailid" id="" required />
                  </div>
                  <div className="col-4 col-md-6  my-2 text-end">Password</div>
                  <div className="col-8 col-md-6 my-2">
                    <input
                      type="password"
                      name="password"
                      id=""
                      maxLength="10"
                      minLength="5"
                    />
                  </div>
                  <div className="col-sm-4 col-6  my-2 text-end"></div>
                  <div className="offset-4 offset-md-6 col-8 col-md-6 my-2 ">
                    <input
                      className="btn btn-danger"
                      type="submit"
                      value="Submit"
                    />{" "}
                    <input
                      className="btn btn-danger"
                      type="reset"
                      value="Clear"
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {/* row ends */}
    </>
  );
}
export default SignupPage;
