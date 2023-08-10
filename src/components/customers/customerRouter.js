import { Route } from "react-router-dom";
import Login from "./login";
import QueriesList from "../lists/customersQueries";
import CustomerQueryView from "./customerQueryView";
import CustomerNav from "./customerNav";

const CustomerRouter = [
  <Route
    path="/customers/login"
    element={
      <>
        <CustomerNav />
        <Login />{" "}
      </>
    }
  ></Route>,
  <Route
    path="/customers/queries"
    element={
      <>
        <CustomerNav />
        <QueriesList />{" "}
      </>
    }
  />,
  <Route
    path="/customers/queries/:queryId"
    element={
      <>
        <CustomerNav />
        <CustomerQueryView />{" "}
      </>
    }
  />,
];
export default CustomerRouter;
