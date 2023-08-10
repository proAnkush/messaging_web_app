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

/**
 *
 * @param {{
 * name: String | undefined,
 * phone: String
 * }} param0
 * @returns
 */
exports.createProfile = async ({ name = "unnamed_agent", phone }) => {
  if (!phone) {
    console.trace(
      "FAILED: cannot create agent profile, because missing required parameter 'phone'"
    );
    return;
  }
  const agentProfile = {
    name: name,
    phoneNumber: DB_UTILS.tryAddCountryCode(phone),
    PK: `AGENT_${uuid()}`, // partition key
    SK: "PROFILE", // sort key
    entityType: "AGENT",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  return await DB.put({
    TableName: "Table1", // utilising single table design, so table name should ideally be generic
    Item: agentProfile,
  })
    .promise()
    .then((res) => {
      console.log(`SUCCESS: create agent '${agentProfile.PK}'.`);
      return { ...res, agent: agentProfile };
    })
    .catch((err) => {
      console.trace(
        `FAILED: create agent '${agentProfile.PK}'. Because: `,
        err
      );
      return;
    });
};

/**
 *
 * @param {String} agentId example : AGENT_123
 */
exports.getById = async (agentId) => {
  if (!agentId) {
    console.trace(
      "FAILED: cannot get agent profile, because missing required parameter 'agentId'"
    );
    return;
  }
  return await DB.get({
    TableName: "Table1",
    Key: {
      PK: agentId,
      SK: "PROFILE",
    },
  })
    .promise()
    .then((res) => {
      console.log(`SUCCESS: get agent '${agentId}'.`);
      if (!res.Item) {
        return;
      }
      return {
        agentId: res?.Item?.PK,
        phone: res?.Item?.phoneNumber,
        name: res?.Item?.name,
        createdAt: res?.Item?.createdAt,
        updatedAt: res?.Item?.updatedAt,
      };
    })
    .catch((err) => {
      console.trace(`FAILED: get agent '${agentId}'. Because: `, err);
      return;
    });
};
exports.getAllAgents = async () => {
  return await DB.query({
    TableName: "Table1",
    IndexName: "inverted-key-index",
    KeyConditionExpression: "SK = :dyn1 AND begins_with(PK, :dyn2)",
    ExpressionAttributeValues: {
      ":dyn1": "PROFILE",
      ":dyn2": "AGENT_",
    },
  })
    .promise()
    .then((res) => {
      console.log("SUCCESS: get all agents");
      return {
        count: res.Count,
        agents: res?.Items?.map((item) => {
          return {
            agentId: item?.PK,
            name: item?.name,
            phone: item?.phoneNumber,
            createdAt: item?.createdAt,
            updatedAt: item?.updatedAt,
          };
        }),
      };
    })
    .catch((err) => {
      console.trace("FAILED: get all agents. Because: ", err);
      return;
    });
};
exports.getAgentByPhone = async (phone) => {
  if (!phone) {
    console.trace(
      "FAILED: cannot get agent profile, because missing required parameter 'phone'"
    );
    return;
  }
  return DB.query({
    TableName: "Table1",
    IndexName: "phoneNumber-PK-index",
    KeyConditionExpression: "phoneNumber = :dyn1 AND begins_with(PK, :dyn2)",
    ExpressionAttributeValues: {
      ":dyn1": DB_UTILS.tryAddCountryCode(phone),
      ":dyn2": "AGENT_",
    },
    Limit: 1,
  })
    .promise()
    .then((res) => {
      console.log(`SUCCESS: find agent by phone '${phone}'`, res);
      if (res.Count === 0) return;
      return {
        ...res?.Items?.[0],
        name: res?.Items?.[0].name,
        phoneNumber: res?.Items?.[0].phoneNumber,
      };
    })
    .catch((err) => {
      console.trace(`FAILED: find agent by phone '${phone}'. Because: `, err);
      return;
    });
};
