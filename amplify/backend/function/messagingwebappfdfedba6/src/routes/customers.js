var express = require("express");
var router = express.Router();
const customerController = require("../controllers/customers");

/* GET users listing. */
router.get("/", customerController.getAllCustomers);

// customer messages
router.get(
  "/:customerId/queries/:queryId/messages",
  customerController.getAllMessages
);
router.post(
  "/:customerId/queries/:queryId/messages",
  customerController.createMessage
);

// customer queries
router.get("/:customerId/queries", customerController.getCustomerQueries);
router.get(
  "/:customerId/queries/:queryId",
  customerController.getCustomerQuery
);
router.post("/:customerId/queries", customerController.createQuery);

// others
router.get("/:customerId", customerController.getCustomerProfile);

router.post("/", customerController.createCustomerProfile);

module.exports = router;
