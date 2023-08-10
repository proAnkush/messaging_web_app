import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function CustomerNav() {
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
  const navHeader = {
    margin: "20px",
    color: "white",
  };
  const [navHeading, setNavHeading] = useState("");
  useEffect(() => {
    let profile = JSON.parse(localStorage.getItem("profile"));
    console.log(profile);
    profile && profile.PK && setNavHeading(profile.PK);
    return () => {};
  });

  return (
    <div style={navStyle}>
      <Link style={listLink} to="/">
        Home
      </Link>

      <Link style={listLink} to="/customers/queries">
        My Queries
      </Link>
      <p style={navHeader}>{navHeading}</p>
    </div>
  );
}

export default CustomerNav;
