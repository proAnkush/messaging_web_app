import logo from './logo.svg';
import './App.css';
import { Link, Route, Routes } from "react-router-dom";
import AgentRouter from "./components/agents/agentRouter";
import CustomerRouter from "./components/customers/customerRouter";
import WhichPortal from "./whichPortal";
import * as React from "react";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<WhichPortal />}></Route>
      </Routes>
      <Routes>{AgentRouter}</Routes>
      <Routes>{CustomerRouter}</Routes>
    </div>
  );
}

export default App;
