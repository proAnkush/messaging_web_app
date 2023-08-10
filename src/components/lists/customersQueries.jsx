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

export default function QueriesList() {
  const [queries, setQueries] = React.useState([]);
  const [createQueryInput, setCreateQueryInput] = React.useState("");
  React.useEffect(() => {
    let customerProfile = JSON.parse(localStorage.getItem("profile"));
    console.log(customerProfile);
    if (!customerProfile || !customerProfile.PK) {
      return alert("You are not logged in as AGENT");
    }
    fetchQueries(customerProfile.PK);
    return () => {};
  }, []);

  function fetchQueries(customerId) {
    axios
      .get(config.backendBaseUrl + `/customers/${customerId}/queries`)
      .then((res) => {
        console.log(res);
        setQueries(res.data.queries);
      })
      .catch((err) => {
        if (err) {
          console.trace(err);
          alert(err?.response?.data);
        }
      });
  }

  const createQuery = () => {
    let createQueryTitle = createQueryInput;
    let customerProfile = JSON.parse(localStorage.getItem("profile"));

    console.log(customerProfile);
    axios
      .post(
        config.backendBaseUrl + `/customers/${customerProfile.PK}/queries`,
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
              {/* <TableCell align="right">Customer Id</TableCell> */}
              <TableCell align="right">Title</TableCell>
              <TableCell align="right">Created At</TableCell>
              <TableCell align="right">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {queries.map((query) => (
              <TableRow
                key={query?.queryId}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  <Link to={`/customers/queries/${query?.queryId}`}>
                    {query?.queryId}
                  </Link>
                </TableCell>
                {/* <TableCell align="right">{query?.customerId}</TableCell> */}
                <TableCell align="right">{query?.queryTitle}</TableCell>
                <TableCell align="right">
                  {new Date(query?.createdAt).toLocaleString()}
                </TableCell>
                <TableCell align="right">{query?.queryStatus}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <div>
        <input
          type="text"
          placeholder="queryTitle"
          value={createQueryInput}
          onChange={(e) => setCreateQueryInput(e.target.value)}
        />
        <button onClick={createQuery}>Create Query</button>
      </div>
    </div>
  );
}
