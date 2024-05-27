import React, { useState, useEffect } from "react";
import axios from "axios";

import { Navigate, Link } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import { BsThreeDots } from "react-icons/bs";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface User {
  fname: string;
  lname: string;
  username: string;
  profile_picture: string;
  posts: Post[];
}

interface Post {
  post_id: number;
  user_id: number;
  post_desc: string;
  post_img: string;
  fname: string;
  lname: string;
  profile_picture: string;
}

function Post2() {
  const [userData, setUserData] = useState<User>({
    fname: "",
    lname: "",
    username: "",
    profile_picture: "",
    posts: [],
  });

  const [userActivity, setUserActivity] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("logged") === "true"
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserActivity(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("User Activity:", userActivity);
  };

   const [liked, setLiked] = useState(false);

  useEffect(() => {
    axios
      .get<Post[]>("http://localhost:8081/display_all")
      .then((response) => {
        console.log("User Data Response:", response.data);
        setUserData((prevUserData) => ({
          ...prevUserData,
          posts: response.data,
        }));
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, []);

  useEffect(() => {
    const hidePostSuccessful = localStorage.getItem("hidePostSuccessful");

    if (hidePostSuccessful) {
      toast.success("Hide Post successful!");
      localStorage.removeItem("hidePostSuccessful");
    }
  }, []);

  const hidePost = (postId: number) => {
    axios
      .post(`http://localhost:8081/hide_post/${postId}`)
      .then((response) => {
        localStorage.setItem("hidePostSuccessful", "true");
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error hiding post:", error);
      });
  };

  if (isLoggedIn) {
    return (
      <div>
        <hr
          style={{
            width: "1000px",
            marginLeft: "150px",
            height: "5px",
            border: "none",
            backgroundColor: "black",
          }}
        />
        {/* Profile Post Tab */}
        <div className="tab-pane fade active show" id="profile-post">
          {/* Your existing posts content goes here */}
          <ul className="timeline">
            {userData?.posts.map((post, index) => (
              <React.Fragment key={post.post_id}>
                <li>
                  {/* Timeline Body */}
                  <div className="timeline-body  ">
                    {/* Timeline Header */}
                    <div className="timeline-header d-flex justify-content-between">
                      <div className="d-flex">
                        <span className="userimage">
                          <img src={post.profile_picture} alt="" />
                        </span>
                        <span className="username">
                          <a href="javascript:;">
                            {post.fname} {post.lname}
                          </a>{" "}
                          <small></small>
                        </span>
                      </div>
                      <Dropdown drop="down" data-bs-theme="dark">
                        <Dropdown.Toggle
                          id=""
                          variant=""
                          style={{
                            background: "none",
                            border: "none",
                            textDecoration: "none",
                          }}
                        >
                          <BsThreeDots
                            style={{ fontSize: "1.5rem", color: "black" }}
                          />
                        </Dropdown.Toggle>

                        <Dropdown.Menu className="dropdownnav">
                          <div
                            style={{ textDecoration: "none", color: "black" }}
                          >
                            {/* Assuming you're using React Router */}
                            <Link
                              to="#"
                              className="dropdown-item"
                              onClick={() => hidePost(post.post_id)}
                            >
                              Hide Post
                            </Link>
                          </div>
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                    {/* Timeline Content */}
                    <div className="timeline-content">
                      <p>{post.post_desc}</p>
                      <div className="imagepost">
                        <img src={post.post_img} alt="" />
                      </div>
                    </div>
                    {/* Timeline Likes */}
                    <div className="timeline-likes">
                      <div className="stats-right">
                        <span className="stats-text">1000 Shares</span>
                        <span className="stats-text">2M Comments</span>
                      </div>
                      <div className="stats">
                        <span className="fa-stack fa-fw stats-icon">
                          <i className="fa fa-circle fa-stack-2x text-danger"></i>
                          <i className="fa fa-heart fa-stack-1x fa-inverse t-plus-1"></i>
                        </span>
                        <span className="fa-stack fa-fw stats-icon">
                          <i className="fa fa-circle fa-stack-2x text-primary"></i>
                          <i className="fa fa-thumbs-up fa-stack-1x fa-inverse"></i>
                        </span>
                        <span className="stats-total">400M</span>
                      </div>
                    </div>
                    {/* Timeline Footer */}
                    <div className="timeline-footer">
                      <a
                        href="javascript:;"
                        className="m-r-15 text-inverse-lighter"
                      >
                        <i className="fa fa-thumbs-up fa-fw fa-lg m-r-3"></i>{" "}
                        Like
                      </a>
                      <a
                        href="javascript:;"
                        className="m-r-15 text-inverse-lighter"
                      >
                        <i className="fa fa-comments fa-fw fa-lg m-r-3"></i>{" "}
                        Comment
                      </a>
                      <a
                        href="javascript:;"
                        className="m-r-15 text-inverse-lighter"
                      >
                        <i className="fa fa-share fa-fw fa-lg m-r-3"></i> Share
                      </a>
                    </div>
                    {/* Timeline Comment Box */}
                    <div className="timeline-comment-box">
                      <div className="input">
                        <form action="">
                          <div className="input-group">
                            <input
                              type="text"
                              className="form-control rounded-corner"
                              placeholder="Write a comment..."
                            />
                            <span className="input-group-btn p-l-10">
                              <button
                                className="btn btn-primary f-s-12 rounded-corner"
                                type="button"
                              >
                                Comment
                              </button>
                            </span>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </li>
                {index < userData.posts.length - 1 && (
                  <hr
                    style={{
                      width: "1000px",
                      marginLeft: "150px",
                      height: "5px",
                      border: "none",
                      backgroundColor: "gray",
                    }}
                  />
                )}
              </React.Fragment>
            ))}
          </ul>
          {/* End Timeline */}
        </div>
        {/* End Profile Post Tab */}
      </div>
    );
  } else {
    alert("This page is restricted, action aborted.");
    return <Navigate to={"/"} />;
  }
}

export default Post2;
