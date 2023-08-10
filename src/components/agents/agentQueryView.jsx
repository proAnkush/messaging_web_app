// import axios from "axios";

import { API } from "aws-amplify";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import config from "../../config";
import MessageList from "../lists/MessageList";

function AgentQueryView(props) {
  const messageListReferance = React.createRef();
  const [customerQuery, setCustomerQuery] = useState({});
  const [messages, setMessages] = useState([]);
  const [agentProfile, setAgentProfile] = useState({});
  const [message, setMessage] = useState();
  let params = useParams();
  useEffect(() => {
    let agentProfile = JSON.parse(localStorage.getItem("profile"));
    if (!agentProfile || !agentProfile.PK) {
      return alert("not logged in as agent");
    }
    console.log(params);
    let queryId = params.queryId;
    fetchQuery(agentProfile.PK, queryId);
    fetchMessages(agentProfile.PK, queryId);
    setAgentProfile(agentProfile);
    return () => {};
  }, []);
  const sendMessage = async () => {
    let msgContent = message;
    console.log(agentProfile);
    console.log(customerQuery);
    API.post(
      "mwabapi",
      `/agents/${agentProfile.PK}/queries/${customerQuery.queryId}/messages`,
      {
        messageBody: msgContent,
      }
    )
      .then((res) => {
        console.log(messages);
        fetchMessages(agentProfile.PK, customerQuery.queryId);
        setMessage("");
      })
      .catch((err) => {
        console.error(err);
        if (err.response.data) {
          alert(err.response.data);
        }
      });
  };
  const fetchQuery = (agentId, queryId) => {
    if (!agentId || !queryId) {
      return console.log("no agentId, queryId");
    }
    API.get("mwabapi", `/agents/${agentId}/queries/${queryId}`)
      .then((res) => {
        console.log("res", res);
        setCustomerQuery(res.data || {});
      })
      .catch((err) => {
        console.trace("er", err);
        return;
      });
  };
  const fetchMessages = (agentId, queryId) => {
    if (!agentId || !queryId) {
      return console.log("no agentId, queryId");
    }
    API.get("mwabapi", `/agents/${agentId}/queries/${queryId}/messages`)
      .then((res) => {
        console.log("res2", res);
        let msgs = (res.data && res.data.messages) || [];
        msgs = msgs.map((message) => {
          return {
            position: (message.messageSender === agentId && "right") || "left",
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
  const handleChangeQueryStatus = (e, queryId, customerId, agentId) => {
    let newStatus = e.target.value;
    if (!newStatus || !queryId || !customerId || !agentId) {
      console.log("one of required value is undefined");
      console.log(newStatus, queryId, customerId, agentId);
      return;
    }

    API.put("mwabapi", `/agents/${agentId}/queries/${queryId}`, {
      newStatus: newStatus,
      customerId: customerId,
    })
      .then((res) => {
        console.log(res);
        fetchQuery(agentId, queryId);
        fetchMessages(agentId, queryId);
      })
      .catch((err) => {
        console.log(err);
        if (err.response.data) {
          alert(err.response.data);
        }
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
            <b>Query Status</b>:{" "}
            <select
              name=""
              id=""
              onChange={(e) =>
                handleChangeQueryStatus(
                  e,
                  customerQuery.queryId,
                  customerQuery.customerId,
                  agentProfile.PK
                )
              }
            >
              {["agentAssigned", "closed"].map((status) => {
                return (
                  <option
                    value={status}
                    selected={status === customerQuery.queryStatus}
                  >
                    {status}
                  </option>
                );
              })
              // {customerQuery.queryStatus}
              }
            </select>
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
          agentId={agentProfile.agentId}
        /> */}
      </div>
      {(customerQuery.agentId === agentProfile.PK && (
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
      )) || (
        <div style={{ fontSize: "1.1em" }}>
          You cannot participate in this chat, as you are not the agent assigned
          to this query.
        </div>
      )}
    </div>
  );
}

export default AgentQueryView;
