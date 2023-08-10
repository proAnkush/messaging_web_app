var express = require("express");
var router = express.Router();
const agentTable = require("../db/agent");
const agentController = require("../controllers/agents");

router.get(
  "/:agentId/queries/:queryId/messages",
  agentController.getAllMessages
);
router.post(
  "/:agentId/queries/:queryId/messages",
  agentController.createMessage
);

router.post("/:agentId/queries/:queryId", agentController.assignQueryToAgent);
router.put("/:agentId/queries/:queryId", agentController.changeQueryStatus);
router.get("/:agentId/queries/:queryId", agentController.agentGetQuery);

router.get("/:agentId/queries", agentController.agentGetAllQueries);

router.get("/:agentId", agentController.getAgentById);

router.post("/", agentController.createAgentProfile);
router.get("/", agentController.getAllAgents);

module.exports = router;
