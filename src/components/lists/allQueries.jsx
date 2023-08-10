import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import axios from "axios";
import config from "../../config";
import { Link } from "react-router-dom";
import { FormControl, MenuItem, Select } from "@mui/base";
import { InputLabel } from "@mui/material";

function AllQueries() {
  const [queries, setQueries] = React.useState([]);
  const [agents, setAgents] = React.useState([]);
  React.useEffect(() => {
    fetchAllQueries();
    fetchAllAgents();
    return () => {};
  }, []);

  const fetchAllQueries = () => {
    axios
      .get(config.backendBaseUrl + "/queries")
      .then((res) => {
        setQueries(res.data.queries);
      })
      .catch((err) => {
        console.log(err);
        if (err?.response?.data) {
          alert(err?.response?.data);
        }
      });
  };
  const fetchAllAgents = () => {
    axios
      .get(config.backendBaseUrl + "/agents")
      .then((res) => {
        console.log("all agents: ", res.data.agents);
        setAgents(res.data.agents || []);
      })
      .catch((err) => {
        console.log(err);
        if (err?.response?.data) {
          alert(err?.response?.data);
        }
      });
  };

  const handleAgentAssigned = (e, queryId) => {
    let agentId = e.target.value;
    let agentProfile = JSON.parse(localStorage.getItem("profile"));
    console.log(agentId);
    console.log(queryId);
    axios
      .post(
        config.backendBaseUrl + `/agents/${agentProfile.PK}/queries/${queryId}`,
        {
          agentId: agentId,
        }
      )
      .then((res) => {
        console.log(res);
        fetchAllQueries();
      })
      .catch((err) => {
        console.log(err);
        if (err?.response?.data) {
          alert(err?.response?.data);
        }
      });
  };

  return (
    <div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Query Id</TableCell>
              <TableCell align="right">Customer Id</TableCell>
              <TableCell align="right">Title</TableCell>
              <TableCell align="right">Created At</TableCell>
              <TableCell align="right">Status</TableCell>
              <TableCell align="right">Assigned Agent</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {queries.map((query) => (
              <TableRow
                key={query?.queryId}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  <Link to={`/agents/queries/${query?.queryId}`}>
                    {query?.queryId}
                  </Link>
                </TableCell>
                <TableCell align="right">{query?.customerId}</TableCell>
                <TableCell align="right">{query?.queryTitle}</TableCell>
                <TableCell align="right">{query?.createdAt}</TableCell>
                <TableCell align="right">{query?.queryStatus}</TableCell>
                <TableCell align="right">
                  {(!query?.agentId && (
                    <select
                      name=""
                      id=""
                      style={{ width: "200px" }}
                      onChange={(e) => handleAgentAssigned(e, query.queryId)}
                    >
                      {agents?.map((agent) => {
                        return (
                          <option value={agent.agentId}>
                            {agent.name} - {agent.agentId}
                          </option>
                        );
                      })}
                    </select>
                  )) || <p>{query?.agentId}</p>}
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
