import { API } from "aws-amplify";
import axios from "axios";
import React, { useState } from "react";
import { redirect, useNavigate } from "react-router-dom";
import config from "../../config";
function Login() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();
  // console.log(process.env);
  const handlePhoneInput = (e) => {
    e.preventDefault();
  };
  const login = async (e) => {
    e.preventDefault();
    if (!phone || !name) {
      return alert("please provide phone and name");
    }
    let profile = await API.post("mwabapi2", "/customers", {
      body: { customerName: name, customerPhone: phone },
    })
      .then((res) => {
        console.log(res);
        localStorage.setItem("profile", JSON.stringify(res.customerProfile));
        navigate("/customers/queries");
      })
      .catch((err) => {
        if (err && err.response && err.response.data) {
          alert(err.response.data);
        }
        return;
      });
  };
  const formStyle = {
    display: "flex",
    flexDirection: "column",
    width: "30%",
    minWidth: "480px",
    maxWidth: "560px",
  };
  const loginPageStyle = {
    border: "2px",
    width: "100vw",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  };
  const formInputStyle = {
    margin: "8px 0px",
    borderRadius: "8px",
    fontSize: "1.2em",
    padding: "4px 12px",
  };
  const submitButtonStyle = {
    background: "rebeccapurple",
    color: "white",
    width: "60%",
    maxWidth: "300px",
    alignSelf: "center",
  };
  return (
    <div style={loginPageStyle}>
      <h1>Login as Customer</h1>
      <form style={formStyle} action="">
        <input
          name="name"
          style={formInputStyle}
          type="text"
          placeholder="Your name"
          onChange={(e) => setName(e.target.value)}
        />
        <input
          style={formInputStyle}
          type="tel"
          placeholder="Your phone number"
          onChange={(e) => setPhone(e.target.value)}
        />
        <button
          style={{ ...formInputStyle, ...submitButtonStyle }}
          onClick={login}
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default Login;
