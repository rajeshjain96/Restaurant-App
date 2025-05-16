import axios from "axios";
import { useState } from "react";

export default function LoginSignupPage(props) {
  const [formData, setFormData] = useState({
    emailId: "",
    password: "",
    confirmPassword: "",
  });
  let [message, setMessage] = useState("");
  let [status, setStatus] = useState("checkEmail");
  const [formType, setFormType] = useState("login");
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    let newErrors = {};
    if (!formData.emailId) newErrors.emailId = "Email is required";
    if (
      formType === "signup" &&
      (status == "checkEmail" || status == "alreadySetPassword")
    ) {
      return true;
    }
    if ((formType === "login" || formType === "signup") && !formData.password) {
      newErrors.password = "Password is required";
    }
    if (
      formType === "signup" &&
      formData.password !== formData.confirmPassword
    ) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  async function handleSignupFormSubmit() {
    let response = await axios.post(
      "http://localhost:3000/users/signup",
      formData
    );
    response = response.data;
    if (response.result == "na") {
      showMessage("This email-id is not registered by the Admin.");
    } else if (response.result == "setPassword") {
      setStatus("setPassword");
      showMessage(
        "This email-id is registered by the Admin. Its time to set the password"
      );
    } else if (response.result == "alreadySetPassword") {
      showMessage("You have already signed-up");
    } else if (response.result == "signupSuccess") {
      showMessage("Sign-up operation successful");
    }
  }
  async function handleLoginFormSubmit() {
    let response = await axios.post(
      "http://localhost:3000/users/login",
      formData
    );
    response = response.data;
    if (response.result == "na") {
      showMessage("This email-id is not registered by the Admin.");
    } else if (response.result == "disabled") {
      showMessage("This account is disabled by the Admin.");
    } else if (response.result == "signupFirst") {
      showMessage("First time login. Please signup to set the password.");
    } else if (response.result == "wrongPassword") {
      showMessage("You entered wrong password");
    } else if (response.result == "validUser") {
      showMessage("Login Successful");
      props.setLoggedinUser(response.user);
    }
  }
  function showMessage(m) {
    setMessage(m);
    window.setTimeout(() => {
      setMessage("");
    }, 5000);
  }
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;
    // console.log(formData);
    if (formType == "signup") {
      // check whether user is added by the admin or not.
      handleSignupFormSubmit();
    } else if (formType === "login") {
      handleLoginFormSubmit();
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div className="card shadow w-100" style={{ maxWidth: "400px" }}>
        <div className="card-body">
          <div className="text-center text-danger my-3">{message}</div>
          <ul className="nav nav-tabs mb-4" role="tablist">
            <li
              className="nav-item"
              onClick={() => {
                setFormType("login");
              }}
            >
              <button className={`nav-link ${formType === "login"}`}>
                Login
              </button>
            </li>
            <li
              className="nav-item"
              onClick={() => {
                setFormType("signup");
              }}
            >
              <button
                className={`nav-link ${formType === "signup" ? "active" : ""}`}
              >
                Signup
              </button>
            </li>
          </ul>

          {formType === "login" && (
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <input
                  name="emailId"
                  type="email"
                  className="form-control"
                  placeholder="Email"
                  onChange={handleChange}
                />
                {errors.emailId && (
                  <div className="text-danger mt-1 small">{errors.emailId}</div>
                )}
              </div>
              <div className="mb-3">
                <input
                  name="password"
                  type="password"
                  className="form-control"
                  placeholder="Password"
                  onChange={handleChange}
                />
                {errors.password && (
                  <div className="text-danger mt-1 small">
                    {errors.password}
                  </div>
                )}
              </div>
              <button type="submit" className="btn btn-primary w-100">
                Login
              </button>
            </form>
          )}

          {formType === "signup" && (
            <form onSubmit={handleSubmit}>
              {
                <div className="mb-3">
                  <input
                    name="emailId"
                    type="email"
                    className="form-control"
                    placeholder="Email"
                    onChange={handleChange}
                  />
                  {errors.emailId && (
                    <div className="text-danger mt-1 small">
                      {errors.emailId}
                    </div>
                  )}
                </div>
              }
              {status == "setPassword" && (
                <div className="mb-3">
                  <input
                    name="password"
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    onChange={handleChange}
                  />
                  {errors.password && (
                    <div className="text-danger mt-1 small">
                      {errors.password}
                    </div>
                  )}
                </div>
              )}
              {status == "setPassword" && (
                <div className="mb-3">
                  <input
                    name="confirmPassword"
                    type="password"
                    className="form-control"
                    placeholder="Confirm Password"
                    onChange={handleChange}
                  />
                  {errors.confirmPassword && (
                    <div className="text-danger mt-1 small">
                      {errors.confirmPassword}
                    </div>
                  )}
                </div>
              )}
              <button type="submit" className="btn btn-dark w-100">
                Signup
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
