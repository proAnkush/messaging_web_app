const customerTable = require("../db/customer");
const queriesTable = require("../db/query");
const messageTable = require("../db/message");

exports.getCustomerProfile = async (req, res, next) => {
  let customerId = req?.params?.customerId;
  if (!customerId) {
    res.status(400).send("no customerId in params.");
  }

  let customerProfile = await customerTable.getById(customerId);
  if (!customerProfile || Object.keys(customerProfile).length === 0) {
    return res.status(400).send("couldn't find customer");
  }
  return res.status(200).json({
    ...customerProfile,
    message: "customer profile fetched successfully",
  });
};
exports.createCustomerProfile = async (req, res, next) => {
  let { customerName, customerPhone } = req.body;
  if (!customerPhone) {
    return res
      .status(400)
      .send("please provide 'customerPhone' in request body.");
  }
  let existingCustomer = await customerTable.getCustomerByPhone(customerPhone);
  if (existingCustomer) {
    return res.status(201).json({
      message: "using already existing customer.",
      customerProfile: existingCustomer,
    });
  }
  let createCustomerResponse = await customerTable.createProfile({
    name: customerName,
    phone: customerPhone,
  });
  if (
    !createCustomerResponse ||
    Object.keys(createCustomerResponse).length === 0
  ) {
    return res
      .status(400)
      .send("couldn't create customer profile. make sure phone is valid");
  }
  return res.status(201).json({
    message: "customer created successfully",
    customerProfile: createCustomerResponse?.customer || {},
  });
};
exports.getCustomerQueries = async (req, res) => {
  let { customerId } = req.params;
  if (!customerId) {
    return res.status(404).send("customerId not found in params");
  }
  let customerQueries = await queriesTable.customerGetAllQueries(customerId);
  return res.status(200).json(customerQueries);
};
exports.getCustomerQuery = async (req, res) => {
  let { customerId, queryId } = req.params;
  if (!customerId || !queryId) {
    return res.status(404).send("'customerId', 'queryId' not found in params");
  }
  let customerQuery = await queriesTable.customerGetQueryById(
    queryId,
    customerId
  );
  if (!customerQuery) return res.status(400).send("no such query");
  return res.status(200).json(customerQuery);
};
exports.createQuery = async (req, res) => {
  let { customerId } = req.params;
  let { queryTitle } = req.body;
  if (!customerId) {
    return res.status(400).send("no 'customerId' in params");
  }
  if (!queryTitle) {
    return res.status(400).send("provide 'queryTitle' in body.");
  }
  let createQueryResponse = await queriesTable.createQuery(
    customerId,
    queryTitle
  );
  if (!createQueryResponse) {
    return res.status(500).send("failed create query");
  }
  return res.status(200).json({
    queryId: createQueryResponse.queryId,
    customerId: customerId,
    message: "query created successfully",
  });
};
exports.getAllMessages = async (req, res) => {
  let { customerId, queryId } = req.params;
  if (!customerId || !queryId) {
    return res.status(400).send("no 'customerId', 'queryId' in params");
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
  let { customerId, queryId } = req.params;
  if (!customerId || !queryId) {
    return res.status(400).send("no 'customerId', 'queryId' in params");
  }
  let { messageBody } = req.body;
  if (!messageBody) {
    return res.status(400).send("please provide 'messageBody' in body");
  }
  let createdMessage = await messageTable.createMessage(customerId, queryId, {
    messageBody,
  });
  if (!createdMessage) {
    return res.status(400).send("couldn't send message");
  }
  return res.status(200).json({
    ...createdMessage,
  });
};

exports.getAllCustomers = async (req, res) => {
  let getAllCustomersResponse = await customerTable.getAllCustomers();
  return res.status(200).json(getAllCustomersResponse);
};
