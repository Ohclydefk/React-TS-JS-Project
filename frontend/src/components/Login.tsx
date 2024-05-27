import { useFormik } from "formik";
import * as Yup from "yup";
import logoImage from "/src/assets/goatmez.png";
import { MDBContainer, MDBRow, MDBCol, MDBInput } from "mdb-react-ui-kit";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login() {
  const navigate = useNavigate();

  const registrationSuccess = localStorage.getItem('registrationSuccess');
  if (registrationSuccess) {
    toast.success("Registration successful!");
    localStorage.removeItem('registrationSuccess');
  }

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Username is required"),
      password: Yup.string().required("Password is required"),
    }),

    onSubmit: (values) => {
      axios
        .post("http://localhost:8081/login", values)
        .then((response) => {
          formik.resetForm();

          if (response.data && response.data.message === "Login successful") {
            formik.setStatus("");
            localStorage.setItem("user", JSON.stringify(response.data.user));
            localStorage.setItem("logged", "true");
            navigate("/home");
          } else {
            formik.setStatus("Invalid username or password");
          }
        })
        .catch((error) => {
          console.error("Error logging in:", error);
          toast.error("Invalid Username or Password");
        });
    },
  });


  return (
    <form onSubmit={formik.handleSubmit}>
      <div>
        <ToastContainer />
      </div>
      <MDBContainer fluid className="black-background">
        <MDBRow>
          <MDBCol sm="6">
            <div className="d-flex flex-column align-items-center justify-content-center ps-5 pt-5">
              <div className="logo-circle mb-3">
                <img src={logoImage} alt="" className="logo-image" />
              </div>
              <span className="h1 fw-bold mb-0">LOG IN</span>

              <div className="d-flex flex-column align-items-center w-100 mt-4 loginboxes">
                <div className="mb-4 white-style loginbox custom-input-width">
                  <label htmlFor="username" className="form-label">
                    Username
                  </label>
                  <MDBInput
                    id="username"
                    name="username"
                    className="form-control"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.username}
                    size="lg"
                    type="username"
                  />
                  {formik.touched.username && formik.errors.username ? (
                    <div className="text-danger">{formik.errors.username}</div>
                  ) : null}
                </div>

                <div className="mb-4 white-style loginbox custom-input-width">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <MDBInput
                    id="password"
                    name="password"
                    className="form-control"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                    size="lg"
                    type="password"
                  />
                  {formik.touched.password && formik.errors.password ? (
                    <div className="text-danger">{formik.errors.password}</div>
                  ) : null}
                </div>

                <button
                  type="submit"
                  disabled={!formik.isValid}
                  className="ms-2 regcustom-color btnreg btnlogin"
                >
                  Login
                </button>
                <p className="mb-3 mt-3">
                  Don't have an account?{" "}
                  <NavLink to="/registration" className="link-info no-style">
                    Register here
                  </NavLink>
                </p>
              </div>
            </div>
          </MDBCol>

          <MDBCol
            sm="6"
            className="d-none d-sm-flex flex-column align-items-center justify-content-center px-0"
          >
            <img
              src="/src/assets/goatmez_love.jpg"
              alt="Login image"
              className="w-100"
              style={{ objectFit: "cover", objectPosition: "left" }}
            />
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </form>
  );
}

export default Login;
