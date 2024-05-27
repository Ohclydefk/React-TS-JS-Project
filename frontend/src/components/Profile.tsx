import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import "font-awesome/css/font-awesome.min.css";
import Post3 from "./Post3";
import Navbar from "./Navbar";
import axios from "axios";
import ScrollUp from "./ScrollUp";
import myImage1 from "../fakeFriendsListImages/1.jpg";
import myImage2 from "../fakeFriendsListImages/2.jpg";
import myImage3 from "../fakeFriendsListImages/3.jpg";
import myImage4 from "../fakeFriendsListImages/4.jpg";
import myImage5 from "../fakeFriendsListImages/5.jpg";
import myImage6 from "../fakeFriendsListImages/6.jpg";

interface HomeProps {}
interface Friend {
  id: number;
  name: string;
}

const Profile: React.FC<HomeProps> = () => {
  //Friendlist API
  const [friendList, setFriendList] = useState<Friend[]>([]);
  const fakeProfiles = [
    myImage1,
    myImage2,
    myImage3,
    myImage4,
    myImage5,
    myImage6,
  ];

  useEffect(() => {
    axios
      .get("https://jsonplaceholder.typicode.com/users")
      .then((res) => {
        setFriendList(res.data.slice(0, 6));
      })
      .catch((err) => alert(err));
  }, []);

  const [userData, setUserData] = useState({
    fname: "",
    lname: "",
    username: "",
    profile_picture: "",
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

  if (isLoggedIn) {
    return (
      <>
        <Navbar />
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div id="content" className="content content-full-width">
                {/* Profile */}
                <div className="container bootstrap snippets bootdey cardprofilecover">
                  <div className="row">
                    <div className="profile-panel">
                      <div className="cover-photo">
                        <div className="cover-overlay"></div>
                        <div className="fb-timeline-img">
                          <img src="/src/assets/goats2.jpg" alt="" />
                        </div>
                        <div className="fb-name">
                          <h3>
                            <p>
                              {userData?.fname} {userData?.lname}
                            </p>
                          </h3>
                        </div>
                      </div>
                      <div className="panel-body">
                        <div
                          className="profile-thumb"
                          style={{ marginRight: "15px" }}
                        >
                          <img src={userData?.profile_picture} alt="" />
                        </div>
                        <p className="fb-user-mail">{userData?.username}</p>
                        {/* Friend List */}
                        <div className="container">
                          <h5>Friends (6)</h5>
                          <div className="friend-list">
                            {friendList.map((friend, index) => (
                              <div key={friend.id} className="friend-card">
                                <img
                                  src={fakeProfiles[index]}
                                  alt={`Friend: ${friend.name}`}
                                />
                                <p className="friend-name">{friend.name}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Tab Content */}
                <div className="tab-content p-0">
                  {/* Profile Post Tab */}
                  <div className="tab-pane fade active show" id="profile-post">
                    {/* Your existing posts content goes here */}
                    {/* ... Add other timeline items here ... */}
                  </div>
                  <Post3 />
                  {/* End Profile Post Tab */}
                </div>
                {/* End Tab Content */}
              </div>
              {/* End Profile Content */}
            </div>
          </div>
        </div>
        <ScrollUp />
      </>
    );
  } else {
    alert("This page is restricted, action aborted.");
    return <Navigate to={"/"} />;
  }
};

export default Profile;
