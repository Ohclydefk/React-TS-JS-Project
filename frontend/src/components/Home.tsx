import React, { useState, useEffect } from "react";
import { Navigate } from "react-router";
import "font-awesome/css/font-awesome.min.css";
import Post2 from "./Post2";
import Navbar from "./Navbar";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ScrollUp from "./ScrollUp";

interface HomeProps {}

const Home: React.FC<HomeProps> = () => {
  const [userData, setUserData] = useState({
    fname: "",
    lname: "",
    username: "",
    profile_picture: "",
    user_id: "",
  });

  const [userActivity, setUserActivity] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("logged") === "true"
  );
  const [file, setFile] = useState<any>();

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserActivity(event.target.value);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setIsLoggedIn(true);
      axios
        .get(`http://localhost:8081/user/${user.user_id}`)
        .then((response) => {
          setUserData(response.data);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!file) {
      console.error("No file selected");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    formData.append("user_id", userData.user_id);
    formData.append("post_desc", userActivity);
    try {
      const response = await axios.post(
        "http://localhost:8081/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.Status === "success") {
        toast.success("Posted successfully!", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000,
        });

        console.log("Upload Success");
        setUserActivity("");
        setFile(undefined);

        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        toast.error("Post failed. Please try again.", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000,
        });
        console.log("Upload Failed");
      }
    } catch (error) {
      console.error("Error uploading post:", error);
    }
  };

  const handleFile = (e: any) => {
    setFile(e.target.files[0]);
  };

  if (isLoggedIn) {
    return (
      <>
        <Navbar />
        <div>
          <ToastContainer />
        </div>
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div id="content" className="content content-full-width">
                {/* Profile Content */}
                <div className="profile-content">
                  <div className="panel-content panel-activity centered-container">
                    <div className="timeline-comment-box1">
                      <div className="user1">
                        <img src={userData?.profile_picture} alt="" />
                      </div>
                    </div>
                    <form
                      onSubmit={handleSubmit}
                      className="panel-activity__status custom-width-form"
                    >
                      <textarea
                        name="user_activity"
                        placeholder="Baa Baa Baa...."
                        className="form-control"
                        value={userActivity}
                        onChange={handleInputChange}
                      />
                      <div className="actions">
                        <div className="btn-group">
                          <label
                            htmlFor="imageInput"
                            className="btn-link"
                            title="Post an Image"
                          >
                            <i className="fa fa-image"></i>
                          </label>
                          <input
                            type="file"
                            id="imageInput"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={handleFile}
                          />
                        </div>
                        <button
                          type="submit"
                          className="btn btn-sm btn-rounded btn-info"
                        >
                          Post
                        </button>
                      </div>
                    </form>
                  </div>
                  <p>&nbsp;</p>
                  {/* Tab Content */}
                  <div className="tab-content p-0">
                    {/* Profile Post Tab */}
                    <div
                      className="tab-pane fade active show"
                      id="profile-post"
                    >
                      {/* Your existing posts content goes here */}
                      {/* ... Add other timeline items here ... */}
                    </div>
                    <Post2 />
                    {/* End Profile Post Tab */}
                  </div>
                  {/* End Tab Content */}
                </div>
                {/* End Profile Content */}
              </div>
            </div>
          </div>
        </div>
        {/* Scroll-to-Top Button */}
        <ScrollUp />
      </>
    );
  } else {
    alert("This page is restricted, action aborted.");
    return <Navigate to={"/"} />;
  }
};

export default Home;
