import { IoSend } from "react-icons/io5";
import Navbar from "./Navbar";
import io from "socket.io-client";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import ScrollToBottom from "react-scroll-to-bottom";

const socket = io("http://localhost:5170");

interface Message {
  room: string;
  author: string;
  message: string;
  time: string;
  profile_picture: any;
}

// ... other imports ...

function Message() {
  const formRef = useRef<HTMLFormElement | null>(null);

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
        profile_picture: userData.profile_picture,
      };

      console.log("sent to: " + messageData.room);
      socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      console.log("Message sent: ", messageData);

      // Clear the input field
      setCurrentMessage("");

      // Reset the form
      if (formRef.current) {
        formRef.current.reset();
      }
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });
  }, [socket]);

  const session = localStorage.getItem("logged") || "false";
  const [isLoggedIn, setIsLoggedIn] = useState(session === "true");
  const [userData, setUserData] = useState({
    fname: "",
    lname: "",
    user_id: "",
    profile_picture: "",
  });

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

  interface User {
    fname: string;
    lname: string;
    user_id: number;
    profile_picture: string;
  }

  const [users, setUsers] = useState<Array<User>>([]);
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const [messageList, setMessageList] = useState<Array<Message>>([]);
  const [room, setRoom] = useState<string>("");
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    axios
      .get<Array<User>>("http://localhost:8081/display_all")
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, []);

  useEffect(() => {
    setRoom("69");
    setUsername(userData.fname);
  });

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="page-title">
          <div className="row gutters">
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
              <h5 className="title">Messages</h5>
            </div>
          </div>
        </div>
        <div className="content-wrapper">
          <div className="row gutters">
            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
              <div className="card123 m-0">
                <div className="row no-gutters">
                  <div className="col-xl-4 col-lg-4 col-md-4 col-sm-3 col-3">
                    <div className="users-container">
                      <div className="chat-search-box">
                        <div className="input-group">
                          <input
                            className="form-control"
                            placeholder="Search"
                          />
                          <div className="input-group-btn">
                            <button type="button" className="btn btn-info">
                              <i className="fa fa-search"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                      <ul className="users">
                        {users.map((user) => (
                          <li
                            key={user.user_id}
                            className="person"
                            data-chat={`person${user.user_id}`}
                          >
                            <div className="user">
                              <img src={user.profile_picture} alt="" />
                            </div>
                            <p className="name-time">
                              <span
                                className="name"
                                style={{ fontWeight: "normal" }}
                              >
                                {user.fname} {user.lname}
                              </span>
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="col-xl-8 col-lg-8 col-md-8 col-sm-9 col-9">
                    <div className="selected-user">
                      <span>
                        <span className="name">Chat Messages</span>
                      </span>
                    </div>
                    <div
                      style={{
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                        overflow: "hidden",
                      }}
                    >
                      <ScrollToBottom>
                        <div className="chat-container">
                          <ul className="chat-box chatContainerScroll">
                            {messageList.map((messageContent, key) => (
                              <li
                                key={key}
                                className={
                                  username === messageContent.author
                                    ? "chat-left"
                                    : "chat-right"
                                }
                              >
                                {username === messageContent.author ? (
                                  <>
                                    <div className="chat-avatar">
                                      <img
                                        src={messageContent.profile_picture}
                                        alt="User Avatar"
                                      />
                                      <div className="chat-name">
                                        {messageContent.author}
                                      </div>
                                    </div>
                                    <div className="chat-text">
                                      {messageContent.message}
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <div className="chat-textright">
                                      {messageContent.message}
                                    </div>
                                    <div className="chat-avatar">
                                      <img
                                        src={messageContent.profile_picture}
                                        alt="User Avatar"
                                      />
                                      <div className="chat-name">
                                        {messageContent.author}
                                      </div>
                                    </div>
                                  </>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </ScrollToBottom>
                      <form
                        ref={formRef}
                        onSubmit={(event) => {
                          event.preventDefault();
                          sendMessage();
                        }}
                      >
                        <div className="form-group mt-3 mb-0">
                          <div className="input-group">
                            <input
                              className="form-control"
                              placeholder="Type your message here..."
                              onChange={(event) => {
                                setCurrentMessage(event.target.value);
                              }}
                            ></input>
                            <div className="input-group-append">
                              <button className="btn btn-primary" type="submit">
                                <IoSend />
                              </button>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Message;
