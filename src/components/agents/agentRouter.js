import { Route } from "react-router-dom";
import * as React from "react";

import Login from "./login";
import QueriesList from "../lists/agentsQueries";
import AgentQueryView from "./agentQueryView";
import AllQueries from "../lists/allQueries";
import AgentNav from "./agentNav";

const AgentRouter = [
  <Route
    path="/agents/login"
    element={
      <>
        <AgentNav />
        <Login />{" "}
      </>
    }
  ></Route>,
  <Route
    path="/agents/queries"
    element={
      <>
        <AgentNav />
        <QueriesList />{" "}
      </>
    }
  />,
  <Route
    path="/agents/queries/all"
    element={
      <>
        <AgentNav />
        <AllQueries />{" "}
      </>
    }
  />,
  <Route
    path="/agents/queries/:queryId"
    element={
      <>
        <AgentNav />
        <AgentQueryView />{" "}
      </>
    }
  />,
];
export default AgentRouter;
