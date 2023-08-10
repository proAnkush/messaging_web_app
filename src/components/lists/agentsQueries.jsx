import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
// import axios from "axios";
import { API } from "aws-amplify";
import config from "../../config";
import { Link } from "react-router-dom";

export default function QueriesList() {
  const [queries, setQueries] = React.useState([]);
  React.useEffect(() => {
    let agentProfile = JSON.parse(localStorage.getItem("profile"));
    console.log(agentProfile);
    // if (!agentProfile || !agentProfile.PK) {
    //   return alert("You are not logged in as AGENT");
    // }
    fetchQueries(agentProfile.PK);
    return () => {};
  }, []);

  function fetchQueries(agentId) {
    API.get("mwabapi2", `/agents/${agentId}/queries`)
      .then((res) => {
        console.log(res);
        setQueries(res.data.queries);
      })
      .catch((err) => {
        if (err) {
          console.trace(err);
          alert(err.response.data);
        }
      });
  }

  return (
    <TableContainer component={Paper} style={{ marginTop: "60px" }}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Query Id</TableCell>
            <TableCell align="right">Customer Id</TableCell>
            <TableCell align="right">Title</TableCell>
            <TableCell align="right">Created At</TableCell>
            <TableCell align="right">Status</TableCell>
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
