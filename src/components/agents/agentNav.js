import React from "react";
import { Link } from "react-router-dom";

function AgentNav() {
  const navStyle = {
    width: "100%",
    display: "flex",
    justifyContent: "right",
    background: "rebeccapurple",
    position: "absolute",
    top: "0",
  };
  const listLink = {
    color: "white",
    margin: "20px",
  };
  return (
    <div style={navStyle}>
      <Link style={listLink} to="/">
        Home
      </Link>

      <Link style={listLink} to="/agents/queries/all">
        All Queries
      </Link>

      <Link style={listLink} to="/agents/queries">
        My Queries
      </Link>
    </div>
  );
}

export default AgentNav;
