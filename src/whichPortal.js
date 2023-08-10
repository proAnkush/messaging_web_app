import React from "react";
import { Link, useNavigate } from "react-router-dom";

function WhichPortal() {
  const whichPortalStyle = {
    width: "100vw",
    height: "100vh",
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
  };
  const asAgentStyle = {
    background: "gray",
    fontSize: "1.6em",
    textAlign: "center",
    cursor: "pointer",
    padding: "50vh 0px",
    color: "white",
  };
  const asCustomerStyle = {
    background: "blanchedalmond",
    fontSize: "1.6em",
    textAlign: "center",
    cursor: "pointer",
    padding: "50vh 0px",
    color: "black",
  };
  const navigate = useNavigate();
  return (
    <div style={whichPortalStyle}>
      <div
        style={asAgentStyle}
        onClick={(e) => {
          navigate("/agents/login");
        }}
      >
        Login as Agent
      </div>
      <div
        style={asCustomerStyle}
        onClick={(e) => navigate("/customers/login")}
      >
        Login as Customer
      </div>
    </div>
  );
}

export default WhichPortal;
