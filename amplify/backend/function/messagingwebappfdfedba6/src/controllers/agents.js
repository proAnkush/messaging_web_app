const agentTable = require("../db/agent");
const queriesTable = require("../db/query");
const messageTable = require("../db/message");

exports.getAgentById = async (req, res, next) => {
  let agentId = req.params.agentId;
  let agentProfile = await agentTable.getById(agentId);
  return res.status(200).json({
    ...agentProfile,
    message: "agent profile fetched successfully",
  });
};

exports.agentGetQuery = async (req, res) => {
  let { agentId, queryId } = req.params;
  let findQueryResponse = await queriesTable.findQuery(queryId);
  if (!findQueryResponse || Object.keys(findQueryResponse).length === 0) {
    return res.status(404).send("no such query");
  }
  return res.status(200).json(findQueryResponse);
};

exports.createAgentProfile = async (req, res, next) => {
  let { agentName, agentPhone } = req.body;
  if (!agentPhone) {
    return res.status(400).send("please provide 'agentPhone' in request body.");
  }
  let existingAgent = await agentTable.getAgentByPhone(agentPhone);
  if (existingAgent) {
    return res.status(201).json({
      message: "using already existing agent.",
      agentProfile: existingAgent,
    });
  }
  let createAgentResponse = await agentTable.createProfile({
    name: agentName,
    phone: agentPhone,
  });
  if (!createAgentResponse || Object.keys(createAgentResponse).length === 0) {
    return res
      .status(400)
      .send("couldn't create profile. Make sure phone valid");
  }
  return res.status(201).json({
    message: "agent created successfully",
    agentProfile: createAgentResponse?.agent || {},
  });
};

exports.agentGetAllQueries = async (req, res) => {
  let agentId = req.params.agentId;
  if (!agentId) {
    console.trace("missing agent id in params");
    return res.status(400).end();
  }
  let queries = await queriesTable.agentGetAllQueries(agentId);
  if (!queries) {
    return res.status(404).send("no queries found.");
  }
  return res.status(200).json(queries);
};

exports.assignQueryToAgent = async (req, res) => {
  let { queryId } = req.params;
  let { agentId } = req.body;
  if (!agentId) {
    return res.status(400).send("please provide 'agentId' in request body.");
  }
  let findQueryResponse = await queriesTable.findQuery(queryId);
  if (!findQueryResponse || Object.keys(findQueryResponse).length === 0) {
    return res.status(404).send("no such query");
  }
  let agentAssignedQuery = await queriesTable.assignQueryToAgent(
    queryId,
    agentId,
    findQueryResponse
  );
  let changeQueryStatusResponse = await queriesTable.changeQueryStatus(
    queryId,
    findQueryResponse.customerId,
    "agentAssigned"
  );
  return res.status(200).json(agentAssignedQuery);
};

exports.getAllAgents = async (req, res) => {
  let getAllAgentsResponse = await agentTable.getAllAgents();
  return res.status(200).json(getAllAgentsResponse);
};

exports.changeQueryStatus = async (req, res) => {
  let { queryId } = req.params;
  let { newStatus, customerId } = req.body;
  if (!newStatus || !newStatus) {
    return res
      .status(400)
      .send("please provide 'newStatus', 'customerId' in body");
  }
  if (!["pending", "agentAssigned", "closed"].includes(newStatus)) {
    return res
      .status(400)
      .send(
        "received invalid 'newStatus' value. valid values are 'pending', 'agentAssigned', 'closed'."
      );
  }
  let changeQueryStatusResponse = await queriesTable.changeQueryStatus(
    queryId,
    customerId,
    newStatus
  );
  if (
    !changeQueryStatusResponse ||
    Object.keys(changeQueryStatusResponse).length === 0
  ) {
    return res.status(404).send("no such query");
  }
  return res.status(200).send("query status changes successfully.");
};

exports.getAllMessages = async (req, res) => {
  let { agentId, queryId } = req.params;
  if (!agentId || !queryId) {
    return res.status(400).send("no 'agentId', 'queryId' in params");
  }
  let messages = await messageTable.getAllMessagesForQuery(queryId);
  if (!messages) {
    return res.status(400).send("couldn't fetch messages");
  }
  if (Object.keys(messages).length === 0) {
    return res.sendStatus(204);
  }
  return res.status(200).json(messages);
};
exports.createMessage = async (req, res) => {
  let { agentId, queryId } = req.params;
  if (!agentId || !queryId) {
    return res.status(400).send("no 'agentId', 'queryId' in params");
  }
  let { messageBody } = req.body;
  if (!messageBody) {
    return res.status(400).send("please provide 'messageBody' in body");
  }
  let createdMessage = await messageTable.createMessage(agentId, queryId, {
    messageBody,
  });
  if (!createdMessage) {
    return res.status(400).send("couldn't send message");
  }
  return res.status(200).json({
    ...createdMessage,
  });
};