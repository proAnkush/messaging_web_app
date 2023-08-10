// import { textAlign } from "@mui/system";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import config from "../../config";
import MessageList from "../lists/MessageList";

function CustomerQueryView(props) {
  const messageListReferance = React.createRef();
  const [customerQuery, setCustomerQuery] = useState({});
  const [messages, setMessages] = useState([]);
  const [customerProfile, setCustomerProfile] = useState({});
  const [message, setMessage] = useState();
  let params = useParams();
  useEffect(() => {
    let customerProfile = JSON.parse(localStorage.getItem("profile"));
    if (!customerProfile || !customerProfile.PK) {
      return alert("not logged in as agent");
    }
    console.log(params);
    let queryId = params.queryId;
    fetchQuery(customerProfile.PK, queryId);
    fetchMessages(customerProfile.PK, queryId);
    setCustomerProfile(customerProfile);
    return () => {};
  }, []);
  const sendMessage = async () => {
    let msgContent = message;
    console.log(customerProfile);
    console.log(customerQuery);
    axios
      .post(
        config.backendBaseUrl +
          `/customers/${customerProfile.PK}/queries/${customerQuery.queryId}/messages`,
        {
          messageBody: msgContent,
        }
      )
      .then((res) => {
        console.log(messages);
        fetchMessages(customerProfile.PK, customerQuery.queryId);
        setMessage("");
      })
      .catch((err) => {
        console.error(err);
        if (err.response.data) {
          alert(err.response.data);
        }
      });
  };
  const fetchQuery = (customerId, queryId) => {
    axios
      .get(
        config.backendBaseUrl + `/customers/${customerId}/queries/${queryId}`
      )
      .then((res) => {
        console.log("res", res);
        setCustomerQuery(res.data);
      })
      .catch((err) => {
        console.trace("er", err);
        return;
      });
  };
  const fetchMessages = (customerId, queryId) => {
    axios
      .get(
        config.backendBaseUrl +
          `/customers/${customerId}/queries/${queryId}/messages`
      )
      .then((res) => {
        console.log("res2", res);
        let msgs = res.data.messages;
        msgs = msgs.map((message) => {
          return {
            position:
              (message.messageSender === customerId && "right") || "left",
            type: "text",
            text: message.messageBody,
            date: message.createdAt,
            senderId: message.messageSender,
          };
        });
        setMessages(msgs);
      })
      .catch((err) => {
        console.trace("er2", err);
        return;
      });
  };
  const mainStyle = {
    display: "flex",
    flexDirection: "column",
    marginTop: "60px",
  };
  const topBarStyle = {
    backgroundColor: "rebeccapurple",
    color: "white",
    height: "20vh",
    minHeight: "180px",
  };
  const bottomBarStyle = {
    maxHeight: "70vh",
    overflowY: "scroll",
    minHeight: "600px",
  };
  const topBarDetailsStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    width: "60%",
    margin: "auto",
  };
  const topBarDetailStyle = {
    textAlign: "left",
    fontSize: "1.1em",
  };
  const inputParentBoxStyle = {
    width: "60%",
    alignSelf: "center",
  };
  const inputBoxStyle = {
    padding: "12px",
    borderRadius: "6px",
    fontSize: "0.9em",
    width: "30%",
    minWidth: "200px",
  };
  const sendMessageButtonStyle = {
    background: "rebeccapurple",
    color: "white",
    fontSize: "0.9em",
    padding: "6px",
    borderRadius: "6px",
    marginLeft: "4px",
  };
  return (
    <div style={mainStyle}>
      <div style={topBarStyle}>
        <div style={topBarDetailsStyle}>
          {console.log(customerQuery)}
          <p style={topBarDetailStyle}>
            <b>QueryId</b>: {customerQuery.queryId}
          </p>
          <p style={topBarDetailStyle}>
            <b>CustomerId</b>: {customerQuery.customerId}
          </p>
          <p style={topBarDetailStyle}>
            <b>Query Title</b>: {customerQuery.queryTitle}
          </p>
          <p style={topBarDetailStyle}>
            <b>Query Status</b>: {customerQuery.queryStatus}
          </p>
          <p style={topBarDetailStyle}>
            <b>Created At</b>: {customerQuery.createdAt}
          </p>
        </div>
      </div>
      <div style={bottomBarStyle}>
        <MessageList messages={messages} />
        {/* <SendMessageComponent
          queryId={customerQuery.queryId}
          agentId={agentProfile?.agentId}
        /> */}
      </div>
      <div style={inputParentBoxStyle}>
        <input
          style={inputBoxStyle}
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="type your response here"
        />
        <button style={sendMessageButtonStyle} onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}

export default CustomerQueryView;
