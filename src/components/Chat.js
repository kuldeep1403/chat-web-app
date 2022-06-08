import React from "react";
import { BsArrowLeft } from "react-icons/bs";
import { Link } from "react-router-dom";
import Input from "./Input";
import Messages from "./Messages";

const Chat = ({
  onCloseChat,
  value,
  setMessage,
  sendMessage,
  groupMessage,
  username,
  receiver,
  sortNames,
  imageUrl
}) => {
  const messages = groupMessage
    ? groupMessage[sortNames(username, receiver)]
    : [];

  return (
    <div className="wrapper">
      <section className="chat-area">
        <header>
          <Link to="/users" className="back-icon" onClick={onCloseChat}>
            <BsArrowLeft className="fas fa-arrow-left" />
          </Link>
          <img src={imageUrl} alt="user" />
          <div className="details">
            <span>{receiver}</span>
            <p>Active Now</p>
          </div>
        </header>
        <Messages messages={messages} username={username} imageUrl={imageUrl} />
        <Input
          message={value}
          setMessage={setMessage}
          sendMessage={sendMessage}
        />
      </section>
    </div>
  );
};

export default Chat;
