import { useFormik } from "formik";
import * as Yup from "yup";
import {
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBRow,
  MDBCol,
  MDBInput,
} from "mdb-react-ui-kit";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";

function Registration() {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      fname: "",
      lname: "",
      username: "",
      password: "",
      cpassword: "",
      phone: "",
      date: "",
      gender: "",
    },
    validationSchema: Yup.object({
      fname: Yup.string()
        .min(3, "First Name must be at least 3 characters")
        .required("First Name is required"),
      lname: Yup.string()
        .min(3, "Last Name must be at least 3 characters")
        .required("Last Name is required"),
      username: Yup.string()
        .email("Invalid username")
        .required("Username is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
      cpassword: Yup.string()
        .min(6, "Confirm Password must be at least 6 characters")
        .oneOf([Yup.ref("password"), undefined], "Passwords must match")
        .required("Confirm Password is required"),
      phone: Yup.string()
        .max(11, "Phone Number should have 11 characters")
        .required("Phone Number is required"),
      date: Yup.string().required("Birth Date is required"),
      gender: Yup.string().required("Gender is required"),
    }),
    onSubmit: (values) => {
      axios
        .post("http://localhost:8081/add_user", values)
        .then((response) => {
          console.log(response.data);

          setTimeout(() => {
            formik.setStatus("");
            localStorage.setItem("registrationSuccess", "true");
            navigate("/");
          }, 1000);
        })
        .catch((error) => {
          console.error("Error adding user:", error);
        });
    },
  });

  useEffect(() => {
    return () => {
      localStorage.removeItem("registrationSuccess");
    };
  }, []);

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="registrationback">
        <MDBRow className="d-flex justify-content-center align-items-center h-100">
          <MDBCol>
            <MDBCard className="regcard_background my-4">
              <MDBRow className="g-0">
                <MDBCol md="6" className="d-none d-md-block">
                  <MDBCardImage
                    src="/src/assets/goatmez2.png"
                    alt="registrationimage"
                    className="rounded-start registrationimg"
                    fluid
                  />
                </MDBCol>
                <MDBCol md="6">
                  <MDBCardBody className="text-black d-flex flex-column justify-content-center">
                    <h3 className="white-style mb-5 text-uppercase fw-bold ">
                      REGISTRATION FORM
                    </h3>
                    <div className="regbox">
                      <MDBRow>
                        <MDBCol md="6">
                          <div className="mb-4 white-style">
                            <label htmlFor="fname" className="form-label">
                              First Name
                            </label>
                            <MDBInput
                              id="fname"
                              name="fname"
                              className="form-control"
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              value={formik.values.fname}
                              size="lg"
                              type="text"
                            />
                            {formik.touched.fname && formik.errors.fname ? (
                              <div className="text-danger">
                                {formik.errors.fname}
                              </div>
                            ) : null}
                          </div>
                        </MDBCol>

                        <MDBCol md="6">
                          <div className="mb-4 white-style">
                            <label htmlFor="lname" className="form-label">
                              Last Name
                            </label>
                            <MDBInput
                              id="lname"
                              name="lname"
                              className="form-control"
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              value={formik.values.lname}
                              size="lg"
                              type="text"
                            />
                            {formik.touched.lname && formik.errors.lname ? (
                              <div className="text-danger">
                                {formik.errors.lname}
                              </div>
                            ) : null}
                          </div>
                        </MDBCol>
                      </MDBRow>

                      <div className="mb-4 white-style">
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
                          <div className="text-danger">
                            {formik.errors.username}
                          </div>
                        ) : null}
                      </div>

                      <div className="mb-4 white-style">
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
                          <div className="text-danger">
                            {formik.errors.password}
                          </div>
                        ) : null}
                      </div>

                      <div className="mb-4 white-style">
                        <label htmlFor="cpassword" className="form-label">
                          Confirm Password
                        </label>
                        <MDBInput
                          id="cpassword"
                          name="cpassword"
                          className="form-control"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.cpassword}
                          size="lg"
                          type="password"
                        />
                        {formik.touched.cpassword && formik.errors.cpassword ? (
                          <div className="text-danger">
                            {formik.errors.cpassword}
                          </div>
                        ) : null}
                      </div>

                      <MDBRow>
                        <MDBCol md="6">
                          <div className="mb-4 white-style">
                            <label htmlFor="date" className="form-label">
                              Birth Date
                            </label>
                            <MDBInput
                              id="date"
                              name="date"
                              className="form-control"
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              value={formik.values.date}
                              size="lg"
                              type="date"
                            />
                            {formik.touched.date && formik.errors.date ? (
                              <div className="text-danger">
                                {formik.errors.date}
                              </div>
                            ) : null}
                          </div>
                        </MDBCol>

                        <MDBCol
                          md="6"
                          className="d-flex justify-content-center"
                        >
                          <div className="mb-4 white-style">
                            <label htmlFor="phone" className="form-label">
                              Phone
                            </label>
                            <MDBInput
                              id="phone"
                              name="phone"
                              className="form-control"
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              value={formik.values.phone}
                              size="lg"
                              type="phone"
                            />
                            {formik.touched.phone && formik.errors.phone ? (
                              <div className="text-danger">
                                {formik.errors.phone}
                              </div>
                            ) : null}
                          </div>
                        </MDBCol>
                      </MDBRow>
                    </div>
                    <div className="mb-4 white-style reggender">
                      <label htmlFor="gender" className="form-label">
                        Gender
                      </label>
                      <div className="select-container">
                        <select
                          id="gender"
                          name="gender"
                          className="form-control"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.gender}
                        >
                          <option value="">Select a Gender... </option>
                          <option value="male" label="Male" />
                          <option value="female" label="Female" />
                          <option value="others" label="Others" />
                        </select>
                      </div>
                      {formik.touched.gender && formik.errors.gender ? (
                        <div className="text-danger">
                          {formik.errors.gender}
                        </div>
                      ) : null}
                    </div>
                    <p>&nbsp;</p>

                    <button
                      type="submit"
                      disabled={!formik.isValid}
                      className="ms-2 regcustom-color btnreg"
                    >
                      Register
                    </button>
                    <div className="d-flex flex-column align-items-center justify-content-center w-100 mt-4 loginboxes">
                      <div className="mb-4 white-style loginbox custom-input-width text-center">
                        <p className="mb-3">
                          Already have an account?{" "}
                          <NavLink to="/" className="link-info no-style">
                            Back to Login
                          </NavLink>
                        </p>
                      </div>
                    </div>
                  </MDBCardBody>
                </MDBCol>
              </MDBRow>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </div>
    </form>
  );
}

export default Registration;
