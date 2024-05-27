import React, { useEffect, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { MDBContainer, MDBNavbar, MDBNavbarBrand } from "mdb-react-ui-kit";
import { IoHomeOutline } from "react-icons/io5";
import { LuMessageSquare } from "react-icons/lu";
import { RxQuestionMarkCircled } from "react-icons/rx";
import { GiGoat } from "react-icons/gi";
import { IoPersonOutline } from "react-icons/io5";
import Dropdown from "react-bootstrap/Dropdown";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import io from "socket.io-client";

const socket = io("http://localhost:5170");

function Navbar() {
  const session = localStorage.getItem("logged") || "false";
  const [isLoggedIn, setIsLoggedIn] = useState(session === "true");
  const navigate = useNavigate();
  const [showChat, setShowChat] = useState(false);

  const [userData, setUserData] = useState({
    fname: "",
    lname: "",
    user_id: "",
  });

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setIsLoggedIn(true);

      axios
        .get(`http://localhost:8081/user/${user.user_id}`)
        .then((response) => {
          console.log("User Data Response:", response.data);
          setUserData(response.data);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleClick = () => {
    localStorage.setItem("logged", "false");
    setIsLoggedIn(false);
    navigate("/");
  };

  const iconStyle = {
    fontSize: "1.6rem",
    cursor: "pointer",
  };

  const profileStyle = {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    marginLeft: "0.5rem",
    fontSize: "1.7rem",
    color: "white",
  };

  const [file, setFile] = useState<any>();

  const handleFile = (e: any) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("image", file);
    formData.append("username", e.currentTarget.username.value);
    formData.append("password", e.currentTarget.password.value);
    formData.append("cpassword", e.currentTarget.password.value);
    formData.append("fname", e.currentTarget.fname.value);
    formData.append("lname", e.currentTarget.lname.value);
    formData.append("phone", e.currentTarget.phone.value);
    formData.append("date", e.currentTarget.date.value);
    formData.append("gender", e.currentTarget.gender.value);
    formData.append("user_id", userData.user_id);

    axios
      .put("http://localhost:8081/edit_user", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        toast.success("Profile updated successfully", {
          position: toast.POSITION.TOP_RIGHT,
        });

        setTimeout(() => {
          localStorage.setItem("Edit Successfully", "true");
          handleClose();
          window.location.reload();
        }, 1000);
      })
      .catch((error) => {
        console.error("Error updating user:", error);
      });
  };

  const [username, setUsername] = useState<string>("");
  const room = 69;

  const joinRoom = () => {
    alert(JSON.stringify(userData));
    console.log(username);
    socket.emit("join_room", room);
    setShowChat(true);
  };

  return (
    <>
      <ToastContainer />
      <nav>
        {isLoggedIn && (
          <MDBNavbar
            className="navbar-color"
            style={{
              alignItems: "center",
              position: "fixed",
              width: "100%",
              zIndex: 1000,
            }}
          >
            <MDBContainer
              fluid
              className="d-flex justify-content-between align-items-center"
            >
              <MDBNavbarBrand>
                <Link
                  to="/home"
                  style={{ textDecoration: "none", color: "white" }}
                >
                  <img
                    src="/src/assets/goatmez.png"
                    height="30"
                    alt=""
                    loading="lazy"
                    className="navlogo-circle me-2 no-style"
                  />
                  G.O.A.T mez
                </Link>
              </MDBNavbarBrand>
              <div className="d-flex custom-gap align-items-center">
                <NavLink to="/home" style={iconStyle} className="nav-link" end>
                  <IoHomeOutline />
                </NavLink>
                <NavLink
                  to="/profile"
                  style={iconStyle}
                  className="nav-link"
                  end
                >
                  <IoPersonOutline />
                </NavLink>
                <NavLink
                  to="/message"
                  style={iconStyle}
                  className="nav-link"
                  onClick={joinRoom}
                >
                  <LuMessageSquare />
                </NavLink>
                <NavLink to="/about" style={iconStyle} className="nav-link">
                  <RxQuestionMarkCircled />
                </NavLink>
              </div>
              <div className="profile" style={profileStyle}>
                <GiGoat />
                <p>&nbsp;</p>
                <div>
                  <Dropdown data-bs-theme="dark">
                    <Dropdown.Toggle
                      id="dropdown-button-dark-example1"
                      variant="secondary"
                    >
                      {`${userData.fname}  ${userData.lname}`}
                    </Dropdown.Toggle>

                    <Dropdown.Menu className="dropdownnav">
                      <div style={{ textDecoration: "none", color: "black" }}>
                        <Link
                          to="#/action-2"
                          className="dropdown-item"
                          onClick={handleShow}
                        >
                          Edit Profile
                        </Link>
                      </div>
                      <Dropdown.Divider />
                      <Dropdown.Item onClick={handleClick}>
                        Logout
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </div>
            </MDBContainer>

            <Modal show={showModal} onHide={handleClose} centered>
              <Modal.Header closeButton>
                <Modal.Title>Edit Profile</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <p></p>
                    <div className="row">
                      <div className="col-md-6">
                        <label htmlFor="fname" className="form-label">
                          First Name
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="fname"
                          name="fname"
                        />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="lname" className="form-label">
                          Last Name
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="lname"
                          name="lname"
                        />
                      </div>
                    </div>
                    <label htmlFor="username" className="form-label">
                      Username
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="username"
                      name="username"
                    />
                    <label htmlFor="password" className="form-label">
                      Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      name="password"
                    />
                    <label htmlFor="phone" className="form-label">
                      Phone
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="phone"
                      name="phone"
                    />
                    <label htmlFor="date" className="form-label">
                      Birthdate
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      id="date"
                      name="date"
                    />
                    <label htmlFor="gender" className="form-label">
                      Gender
                    </label>
                    <select id="gender" className="form-control" name="gender">
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                    <div className="row">
                      <div className="col-md-6">
                        <label
                          htmlFor="profile_picture"
                          className="form-label mt-3"
                        >
                          Profile Picture
                        </label>
                        <input
                          type="file"
                          id="profile_picture"
                          accept="image/*"
                          onChange={handleFile}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <Button variant="primary" type="submit">
                      Save Changes
                    </Button>
                    <Button variant="secondary" onClick={handleClose}>
                      Close
                    </Button>
                  </div>
                </form>
              </Modal.Body>
            </Modal>
          </MDBNavbar>
        )}
      </nav>
      {isLoggedIn && <div style={{ height: "85px" }} />}
    </>
  );
}

export default Navbar;
