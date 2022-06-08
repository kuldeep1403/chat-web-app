import React from "react";
import ScrollToBottom from "react-scroll-to-bottom";


const Messages = ({ messages, username ,imageUrl}) => {
  return (
    <ScrollToBottom>
      <div className="chat-box">
        {messages && messages.length > 0
          ? messages.map((msg, index) => {
              return (
                <>
                  {username !== msg.receiver ? (
                    <div className="chat outgoing">
                      <div className="details" key={index}>
                        <p>{msg.message}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="chat incoming">
                      <img src={imageUrl} alt="user" />
                      <div className="details" key={index}>
                        <p>{msg.message}</p>
                      </div>
                    </div>
                  )}
                </>
              );
            })
          : null}
      </div>
    </ScrollToBottom>
  );
};

export default Messages;
