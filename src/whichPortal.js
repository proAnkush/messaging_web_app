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
    fontSize: "20px",
    textAlign: "center",
    cursor: "pointer",
  };
  const asCustomerStyle = {
    background: "blanchedalmond",
    fontSize: "20px",
    textAlign: "center",
    cursor: "pointer",
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
