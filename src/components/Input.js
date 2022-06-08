import React from "react";
import { BiPaperPlane } from "react-icons/bi";

const Input = ({ message, setMessage, sendMessage }) => {
  return (
    <>
      <form className="typing-area">
        <input
          type="text"
          name="message"
          className="input-field"
          value={message}
          placeholder="Type a message here..."
          onChange={(e) => {
            setMessage(e.target.value);
          }}
          onKeyPress={(e) => (e.key === "Enter" ? sendMessage(e) : null)}
        />
        <button onClick={(e) => sendMessage(e)}>
          <BiPaperPlane />
        </button>
      </form>
    </>
  );
};

export default Input;
