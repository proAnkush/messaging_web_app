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

export default function QueriesList() {
  const [queries, setQueries] = React.useState([]);
  const [createQueryInput, setCreateQueryInput] = React.useState("");
  React.useEffect(() => {
    let customerProfile = JSON.parse(localStorage.getItem("profile"));
    console.log(customerProfile);
    // if (!customerProfile || !customerProfile.PK) {
    //   return alert("You are not logged in as CUSTOMER");
    // }
    fetchQueries(customerProfile.PK);
    return () => {};
  }, []);

  function fetchQueries(customerId) {
    API
      .get("mwabapi", `/customers/${customerId}/queries`)
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

  const createQuery = () => {
    let createQueryTitle = createQueryInput;
    let customerProfile = JSON.parse(localStorage.getItem("profile"));

    console.log(customerProfile);
    API
      .post(
        "mwabapi", `/customers/${customerProfile.PK}/queries`,
        {
          queryTitle: createQueryTitle,
        }
      )
      .then((res) => {
        fetchQueries(customerProfile.PK);
        console.log("created query: ", res);
        setCreateQueryInput("");
      })
      .catch((err) => {
        console.log(err);
        if (err.response.data) {
          alert(err.response.data);
        }
      });
  };

  const createQueryRowStyle = {
    padding: "14px 0px",
    display: "flex",
    flexDirection: "column",
    maxWidth: "300px",
    margin: "auto",
  };
  const createQueryInputStyle = {
    fontSize: "1.2em",
    borderRadius: "6px",
    padding: "4px 8px",
    maxWidth: "600px",
    maxHeight: "600px",
    minWidth: "300px",
    minHeight: "100px",
  };
  const createQuerySubmitStyle = {
    color: "white",
    background: "rebeccapurple",
    fontSize: "1em",
    borderRadius: "6px",
    padding: "4px 8px",
    border: "none",
    maxWidth: "200px",
    margin: "6px auto",
  };

  return (
    <div style={{ marginTop: "60px" }}>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Query Id</TableCell>
              {/* <TableCell align="right">Customer Id</TableCell> */}
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
                  <Link to={`/customers/queries/${query.queryId}`}>
                    {query.queryId}
                  </Link>
                </TableCell>
                {/* <TableCell align="right">{query.customerId}</TableCell> */}
                <TableCell align="right">{query.queryTitle}</TableCell>
                <TableCell align="right">
                  {new Date(query.createdAt).toLocaleString()}
                </TableCell>
                <TableCell align="right">{query.queryStatus}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <div style={createQueryRowStyle}>
        <textarea
          type="text"
          placeholder="What issue are you facing"
          value={createQueryInput}
          onChange={(e) => setCreateQueryInput(e.target.value)}
          style={createQueryInputStyle}
        />
        <button style={createQuerySubmitStyle} onClick={createQuery}>
          Create Query
        </button>
      </div>
    </div>
  );
}
