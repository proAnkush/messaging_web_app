import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
// import axios from "axios";
import config from "../../config";
import { Link } from "react-router-dom";
import { API } from "aws-amplify";

function AllQueries() {
  const [queries, setQueries] = React.useState([]);
  const [agents, setAgents] = React.useState([]);
  const [searchQueryInputValue, setSearchQueryInputValue] = React.useState("");
  const [
    filterQueryStatusInputValue,
    setFilterQueryStatusInputValue,
  ] = React.useState("");
  React.useEffect(() => {
    fetchAllQueries();
    fetchAllAgents();
    return () => {};
  }, []);

  const fetchAllQueries = (
    // searchString = undefined,
    queryStatus = undefined
  ) => {
    const searchString = searchQueryInputValue || undefined;
    queryStatus = queryStatus || filterQueryStatusInputValue || undefined;
    API.get(
      "mwabapi2",
      "/queries" + getQueryString({ searchString, queryStatus })
    )
      .then((res) => {
        setQueries(res.data.queries);
      })
      .catch((err) => {
        console.log(err);
        if (err.response.data) {
          alert(err.response.data);
        }
      });
  };
  const getQueryString = (obj = {}) => {
    if (!obj || Object.keys(obj).length === 0) return "";

    return (
      "?" +
      Object.entries(obj)
        .map(([k, v]) => {
          return (v && `${k}=${v}`) || undefined;
        })
        .join("&")
    );
  };
  const fetchAllAgents = () => {
    API.get("mwabapi2", "/agents")
      .then((res) => {
        console.log("all agents: ", res.data.agents);
        setAgents(res.data.agents || []);
      })
      .catch((err) => {
        console.log(err);
        if (err.response.data) {
          alert(err.response.data);
        }
      });
  };

  const handleAgentAssigned = (e, queryId) => {
    let agentId = e.target.value;
    let agentProfile = JSON.parse(localStorage.getItem("profile"));
    console.log(agentId);
    console.log(queryId);
    API.post("mwabapi2", `/agents/${agentProfile.PK}/queries/${queryId}`, {
      agentId: agentId,
    })
      .then((res) => {
        console.log(res);
        fetchAllQueries();
      })
      .catch((err) => {
        console.log(err);
        if (err.response.data) {
          alert(err.response.data);
        }
      });
  };
  const searchRowStyle = {
    padding: "14px",
    display: "flex",
    justifyContent: "right",
  };
  const searchInputBoxStyle = {
    fontSize: "1em",
    padding: "4px 8px",
  };
  const searchButtonStyle = {
    fontSize: "1em",
    color: "white",
    background: "rebeccapurple",
    border: "none",
  };
  const handleQuerySearch = (e) => {
    // let searchString = searchQueryInputValue;
    // let queryFilter = filterQueryStatusInputValue;
    fetchAllQueries();
  };
  const handleQueryStatusFilter = (e) => {
    let filterStatus = e.target.value;
    setFilterQueryStatusInputValue(filterStatus);
    fetchAllQueries(filterStatus);
  };

  return (
    <div style={{ marginTop: "60px" }}>
      <div style={searchRowStyle}>
        <input
          type="text"
          value={searchQueryInputValue}
          onChange={(e) => setSearchQueryInputValue(e.target.value)}
          style={searchInputBoxStyle}
          placeholder="Search query by title"
        />
        <button style={searchButtonStyle} onClick={handleQuerySearch}>
          Search
        </button>
      </div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Query Id</TableCell>
              <TableCell align="right">Customer Id</TableCell>
              <TableCell align="right">Title</TableCell>
              <TableCell align="right">Created At</TableCell>
              <TableCell align="right">
                Status{" "}
                <select name="" id="" onChange={handleQueryStatusFilter}>
                  {["all", "pending", "agentAssigned", "closed"].map(
                    (item) =>
                      (item === "all" && (
                        <option value={undefined}>all</option>
                      )) || <option value={item}>{item}</option>
                  )}
                </select>
              </TableCell>
              <TableCell align="right">Assigned Agent</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {queries.map((query) => (
              <TableRow
                key={query.queryId}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  <Link to={`/agents/queries/${query.queryId}`}>
                    {query.queryId}
                  </Link>
                </TableCell>
                <TableCell align="right">{query.customerId}</TableCell>
                <TableCell align="right">{query.queryTitle}</TableCell>
                <TableCell align="right">{query.createdAt}</TableCell>
                <TableCell align="right">{query.queryStatus}</TableCell>
                <TableCell align="right">
                  {(!query.agentId && (
                    <select
                      name=""
                      id=""
                      style={{ width: "200px" }}
                      onChange={(e) => handleAgentAssigned(e, query.queryId)}
                    >
                      <option value={undefined} disabled selected>
                        Assign an agent
                      </option>
                      {agents.map((agent) => {
                        return (
                          <option value={agent.agentId}>
                            {agent.name} | {agent.phone}
                          </option>
                        );
                      })}
                    </select>
                  )) || <p>{query.agentId}</p>}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default AllQueries;
