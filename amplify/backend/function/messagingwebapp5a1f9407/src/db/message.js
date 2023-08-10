require("dotenv").config();
const AWS = require("aws-sdk");
AWS.config.update({
  region: process.env.REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
});
const DB = new AWS.DynamoDB.DocumentClient({ region: process.env.REGION });
const uuid = require("uuid").v4;
const DB_UTILS = require("./utils");

exports.getAllMessagesForQuery = async (queryId) => {
  if (!queryId) {
    return console.trace("missing value for required parameter 'queryId'.");
  }
  return await DB.query({
    TableName: "Table1",
    KeyConditionExpression: "PK = :dyn1 AND begins_with(SK, :dyn2)",
    ExpressionAttributeValues: {
      ":dyn1": queryId,
      ":dyn2": "MESSAGE#",
    },
  })
    .promise()
    .then((res) => {
      console.log(`SUCCESS: get all messages for query '${queryId}'`);
      return {
        count: res?.Count || 0,
        messages: res?.Items?.map((item) => {
          return {
            ...item,
            messageId: item?.SK,
            queryId: item?.PK,
          };
        }),
      };
    })
    .catch((err) => {
      console.trace(
        `FAILED: get all messages for query '${queryId}'. Because: `,
        err
      );
      return;
    });
};

exports.createMessage = async (senderId, queryId, { messageBody } = {}) => {
  if (!senderId || !queryId || !messageBody) {
    // senderId could be customerId or agentId
    console.trace(
      "missing values for required parameters 'senderId','queryId', 'messageBody'"
    );
    return;
  }
  let message = {
    PK: queryId,
    SK: `MESSAGE#${new Date().toISOString()}#${senderId}`,
    messageBody: messageBody,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    messageSender: senderId,
  };
  return await DB.put({
    TableName: "Table1",
    Item: message,
  })
    .promise()
    .then((res) => {
      console.log(
        `SUCCESS: create message by sender '${senderId}' for query '${queryId}'`
      );
      return {
        ...res,
        ...message,
      };
    })
    .catch((err) => {
      console.trace(
        `FAILED: create message by sender '${senderId}' for query '${queryId}'. Because: `,
        err
      );
      return;
    });
};
