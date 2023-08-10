import React, { useEffect, useState } from "react";

function SentMessageComponent({ createdAt, content, senderId }) {
  const chatItemStyle = {
    width: "100%",
    display: "flex",
    alignItem: "right",
    justifyContent: "right",
  };

  const chatItemInnerBoxStyle = {
    width: "40%",
    padding: "8px 12px",
    borderRadius: "16px",
    margin: "10px 30px",
    overflowX: "auto",
    background: "bisque",
  };
  const chatContentStyle = {
    textAlign: "left",
  };
  const chatTimeStyle = {
    textAlign: "right",
    opacity: "75%",
    fontSize: "0.7em",
    margin: "4px",
  };
  const chatSenderStyle = {
    opacity: "80%",
    fontSize: "0.8em",
    textAlign: "left",
    /* background: "rebeccapurple"; */
    /* color: "white"; */
    width: "fit-content",
    textDecoration: "underline",
    margin: "4px",
  };
  return (
    <div style={chatItemStyle}>
      <div style={chatItemInnerBoxStyle}>
        <p style={chatSenderStyle}>{senderId}</p>
        <p style={chatContentStyle}>{content}</p>
        <p style={chatTimeStyle}>
          {new Date(createdAt || new Date()).toLocaleString()}
        </p>
      </div>
    </div>
  );
}

function ReceivedMessageComponent({ createdAt, content, senderId }) {
  const chatItemStyle = {
    width: "100%",
    display: "flex",
    alignItem: "left",
  };

  const chatItemInnerBoxStyle = {
    width: "40%",
    padding: "8px 12px",
    borderRadius: "16px",
    margin: "10px 30px",
    overflowX: "auto",
    background: "bisque",
  };
  const chatContentStyle = {
    textAlign: "left",
  };
  const chatTimeStyle = {
    textAlign: "right",
    opacity: "75%",
    fontSize: "0.7em",
    margin: "4px",
  };
  const chatSenderStyle = {
    opacity: "80%",
    fontSize: "0.8em",
    textAlign: "left",
    /* background: "rebeccapurple"; */
    /* color: "white"; */
    width: "fit-content",
    textDecoration: "underline",
    margin: "4px",
  };
  return (
    <div style={chatItemStyle}>
      <div style={chatItemInnerBoxStyle}>
        <p style={chatSenderStyle}>{senderId}</p>
        <p style={chatContentStyle}>{content}</p>
        <p style={chatTimeStyle}>
          {new Date(createdAt || new Date()).toLocaleString()}
        </p>
      </div>
    </div>
  );
}

function MessageList({ messages = [] }) {
  const [messagesEnd, setMessagesEnd] = useState();
  const messageWindowStyle = {
    width: "60%",
    minWidth: "480px",
    margin: "auto",
  };
  useEffect(() => {
    let endMessage = document.getElementById("endDiv");
    setMessagesEnd(endMessage);
    scrollToBottom();
    return () => {};
  }, []);

  const scrollToBottom = () => {
    console.log("me", messagesEnd);
    messagesEnd.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <div style={messageWindowStyle}>
      {console.log(messages)}
      {messages.map((message) => {
        return (
          (message.position === "right" && (
            <SentMessageComponent
              content={message.text}
              createdAt={message.date}
              senderId={message.senderId}
            />
          )) || (
            <ReceivedMessageComponent
              content={message.text}
              createdAt={message.date}
              senderId={message.senderId}
            />
          )
        );
      })}
      {scrollToBottom()}
      <div
        style={{ float: "left", clear: "both" }}
        ref={(el) => {
          setMessagesEnd(el);
        }}
      ></div>
    </div>
  );
}

export default MessageList;
