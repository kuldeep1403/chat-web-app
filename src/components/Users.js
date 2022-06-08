import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { BsDot } from "react-icons/bs";
import socketio from "socket.io-client";
import Chat from "./Chat";

const Users = () => {
  const history = useHistory();
  const [cookies, removeCookie] = useCookies([]);
  const [username, setUserName] = useState("");
  const [users, setUsers] = useState({});
  const [receiver, setReceiver] = useState("");
  const [message, setMessage] = useState("");
  const [groupMessage, setGroupMessage] = useState({});
  const [userSelected, setUserSelected] = useState(false);
  const receiverRef = useRef(null);
  const [imageUrl, setImageUrl] = useState("");
  const [seletedUserPic, setSelectedUserPic] = useState("");
  const [socket, setSocket] = useState();

  //user Authentication logout functionality
  useEffect(() => {
    const verifyUser = async () => {
      if (!cookies.jwt) {
        history.push("/login");
      } else {
        const { data } = await axios.post(
          "https://justchattingserver.herokuapp.com/users",
          {},
          {
            withCredentials: true,
          }
        );
        if (!data.status) {
          removeCookie("jwt");
          history.push("/login");
        } else {
          setUserName(data.user.name);
          setImageUrl(data.user.image.url);
        }
      }
    };
    verifyUser();
  }, [cookies, history, removeCookie]);

  const handleLogout = () => {
    removeCookie("jwt");
    history.push("/login");
    socket.emit("force-disconnect");
  };

  useEffect(() => {
    const Endpoint = "https://justchattingserver.herokuapp.com";
    const socketTEMP = socketio(Endpoint, {
      withCredentials: true,
    });
    setSocket(socketTEMP);
  }, []);

  useEffect(() => {
    if (socket) {
      if (username) {
        socket.emit("new_user", { username, imageUrl });
      }
    }
  }, [username, socket, imageUrl]);

  const sortNames = (username1, username2) => {
    return [username1, username2].sort().join("-");
  };

  const onUserSelect = (username) => {
    setReceiver(users[username].username);
    receiverRef.current = users[username].username;
    setSelectedUserPic(users[username].imageUrl);
    setUserSelected((prevState) => !prevState);
  };

  const onCloseChat = () => {
    receiverRef.current = null;
    setSelectedUserPic("");
    setUserSelected((prevState) => !prevState);
  };

  const sendMessage = (e) => {
    e.preventDefault();
    const data = {
      sender: username,
      receiver,
      message,
      view: false,
    };
    // here we are sending
    if (socket) {
      socket.emit("send_message", data);
      const key = sortNames(username, receiver);
      const tempGroupMessage = { ...groupMessage };
      if (key in tempGroupMessage) {
        tempGroupMessage[key] = [
          ...tempGroupMessage[key],
          { ...data, view: true },
        ];
      } else {
        tempGroupMessage[key] = [{ ...data, view: true }];
      }
      setGroupMessage({ ...tempGroupMessage });
      setMessage("");
    }
  };

  let unseenMessages = [];
  const checkUnseenMessages = (receiver) => {
    const key = sortNames(username, receiver);

    if (key in groupMessage) {
      unseenMessages = groupMessage[key].filter((msg) => !msg.view);
    }
    return unseenMessages.length;
  };

  useEffect(() => {
    if (socket) {
      socket.on("all_users", (users) => {
        setUsers(users);
      });

      socket.on("new_message", (data) => {
        setGroupMessage((prevGroupMessage) => {
          const messages = { ...prevGroupMessage };
          const key = sortNames(data.sender, data.receiver);

          if (receiverRef.current === data.sender) {
            data.view = true;
          }

          if (key in messages) {
            messages[key] = [...messages[key], data];
          } else {
            messages[key] = [data];
          }

          return { ...messages };
        });
      });
      return function cleanup() {
        socket.close();
      };
    }
  }, [socket]);

  const updateMessageView = () => {
    const key = sortNames(username, receiver);
    if (key in groupMessage) {
      const messages = groupMessage[key].map((msg) =>
        !msg.view ? { ...msg, view: true } : msg
      );

      groupMessage[key] = [...messages];
      setGroupMessage({ ...groupMessage });
    }
  };

  useEffect(() => {
    updateMessageView();
  }, [receiver]);

  return (
    <>
      {!userSelected && (
        <div className="wrapper">
          <section className="users">
            <header>
              <div className="content">
                <img src={imageUrl} alt="profile" />
                <div className="details">
                  <span>{username}</span>
                  <p>Active Now</p>
                </div>
              </div>
              <div>
                <button onClick={handleLogout} className="logout">
                  Logout
                </button>
              </div>
            </header>
            <div className="search">
              {Object.keys(users).length > 1 ? (
                <span className="text">Select an user to start chat</span>
              ) : (
                <span className="text">No user is currently online</span>
              )}
              <button type="button"></button>
            </div>
            <div className="users-list">
              {users &&
                Object.keys(users).map((user, index) => (
                  <>
                    {console.log()}
                    {users[user].username !== username ? (
                      <a hidden>
                        <div
                          className="content"
                          key={index}
                          onClick={() => onUserSelect(user)}
                        >
                          <img src={users[user].imageUrl} alt="user"></img>
                          <div className="details">
                            <span>{users[user].username}</span>
                            {checkUnseenMessages(users[user].username) !== 0 ? (
                              <p>
                                {unseenMessages[
                                  unseenMessages.length - 1
                                ].message.substr(0, 25) + "...."}
                              </p>
                            ) : (
                              <p>No new message available</p>
                            )}
                          </div>
                        </div>
                        <div className="status-dot">
                          <BsDot />
                        </div>
                      </a>
                    ) : null}
                  </>
                ))}
            </div>
          </section>
        </div>
      )}
      {userSelected && (
        <Chat
          onCloseChat={onCloseChat}
          value={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
          groupMessage={groupMessage}
          username={username}
          receiver={receiver}
          sortNames={sortNames}
          imageUrl={seletedUserPic}
        />
      )}
    </>
  );
};

export default Users;
