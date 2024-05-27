import React, { useState, useEffect } from "react";
import axios from "axios";
import { Navigate, Link } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import { BsThreeDots } from "react-icons/bs";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";

interface User {
  fname: string;
  lname: string;
  username: string;
  profile_picture: string;
  posts: Post[];
  user_id: any;
}

interface Post {
  post_id: number;
  post_desc: string;
  post_img: string;
}

function Post3() {
  const [userData, setUserData] = useState<User>({
    fname: "",
    lname: "",
    username: "",
    profile_picture: "",
    posts: [],
    user_id: 0,
  });

  const [file, setFile] = useState<any>();
  const [postId, setPostId] = useState<any>(null);

  const handleSubmitUpdate = async () => {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("post_id", postId);
    formData.append("post_desc", userActivity);

    try {
      const response = await axios.put(
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

  const [userActivity, setUserActivity] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("logged") === "true"
  );

  const [showModal, setShowModal] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserActivity(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("User Activity:", userActivity);
  };

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const user = JSON.parse(storedUser);
          setIsLoggedIn(true);
          const response = await axios.get<User>(
            `http://localhost:8081/display_specific/${user.user_id}`
          );
          console.log("User Data Response:", response.data);
          setUserData(response.data);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, []);

  const [pageReloaded, setPageReloaded] = useState(false);
  useEffect(() => {
    const postDeleted = localStorage.getItem("postDeleted");
    if (postDeleted) {
      toast.success("Post Deleted successful!");
      localStorage.removeItem("postDeleted");
    }
  }, []);

  const handleDeletePost = (paramPostId: number) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This Action Cannot Be Undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:8081/delete_post/${paramPostId}`)
          .then((response) => {
            console.log("Post deleted successfully:", response.data);
            localStorage.setItem("postDeleted", "true");
            window.location.reload();
          })
          .catch((error) => {
            console.error("Error deleting post:", error);
          });
      } else {
        console.log("Post deletion canceled");
      }
    });
  };

  if (isLoggedIn) {
    return (
      <div>
        <ToastContainer />
        <div className="tab-pane fade active show" id="profile-post">
          <ul className="timeline">
            {userData?.posts.map((post, index) => (
              <React.Fragment key={post.post_id}>
                <li>
                  <div className="timeline-body">
                    <div className="timeline-header d-flex justify-content-between">
                      <div className="d-flex">
                        <span className="userimage">
                          <img src={userData?.profile_picture} alt="" />
                        </span>
                        <span className="username">
                          <a href="javascript:;">
                            {userData?.fname} {userData?.lname}
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
                            <Link
                              to="#/action-2"
                              className="dropdown-item"
                              onClick={() => {
                                handleShow();
                                setPostId(post.post_id);
                              }}
                            >
                              Edit Post
                            </Link>
                          </div>
                          <Dropdown.Divider />
                          <Link
                            to="#/action-2"
                            className="dropdown-item"
                            onClick={() => handleDeletePost(post.post_id)}
                          >
                            Delete Post
                          </Link>
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                    <div className="timeline-content">
                      <p>{post?.post_desc}</p>
                      <div className="imagepost">
                        <img src={post?.post_img} alt="" />
                      </div>
                    </div>
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
          <Modal show={showModal} onHide={handleClose} centered>
            <Modal.Header closeButton>
              <Modal.Title>Edit Post</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="postDesc" className="form-label">
                    Post Description
                  </label>
                  <textarea
                    className="form-control"
                    id="postDesc"
                    rows={3}
                    value={userActivity}
                    onChange={handleInputChange}
                  />
                  <label
                    htmlFor="postImage"
                    className="form-label mt-3 container-fluid"
                  >
                    Post Image
                  </label>
                  <input
                    type="file"
                    id="postImage"
                    accept="image/*"
                    onChange={handleFile}
                  />
                </div>
              </form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={handleSubmitUpdate}>
                Save Changes
              </Button>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    );
  } else {
    alert("This page is restricted, action aborted.");
    return <Navigate to={"/"} />;
  }
}

export default Post3;
