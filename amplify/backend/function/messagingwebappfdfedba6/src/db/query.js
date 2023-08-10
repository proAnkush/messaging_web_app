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
exports.createProfile = async ({ name = "unnamed_customer", phone }) => {
  if (!phone) {
    console.trace(
      "FAILED: cannot create customer profile, because missing required parameter 'phone'"
    );
    return;
  }
  const customerProfile = {
    name: name,
    phoneNumber: DB_UTILS.tryAddCountryCode(phone),
    PK: `CUS_${uuid()}`, // partition key
    SK: "PROFILE", // sort key
    entityType: "CUSTOMER",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  return await DB.put({
    TableName: "Table1", // utilising single table design, so table name should ideally be generic
    Item: customerProfile,
  })
    .promise()
    .then((res) => {
      console.log(`SUCCESS: create customer '${customerProfile.PK}'.`);
      return { ...res, customer: customerProfile };
    })
    .catch((err) => {
      console.trace(
        `FAILED: create customer '${customerProfile.PK}'. Because: `,
        err
      );
      return;
      // throw err;
    });
};

/**
 *
 * @param {String} queryId example : QUERY_123
 */
exports.customerGetQueryById = async (queryId, customerId) => {
  if (!queryId || !customerId) {
    console.trace(
      "FAILED: cannot get query, because missing required parameter 'queryId', 'customerId'"
    );
    return;
  }
  return await DB.get({
    TableName: "Table1",
    Key: {
      PK: queryId,
      SK: customerId,
    },
  })
    .promise()
    .then((res) => {
      console.log(`SUCCESS: get query '${customerId}'.`);
      if (!res.Item) {
        return;
      }
      return {
        ...res?.Item,
        customerId: res?.Item?.SK,
        queryId: res?.Item?.PK,
        createdAt: res?.Item?.createdAt,
        updatedAt: res?.Item?.updatedAt,
      };
    })
    .catch((err) => {
      console.trace(`FAILED: get query '${queryId}'. Because: `, err);
      // throw err;
      return;
    });
};

exports.agentGetQueryById = async (queryId, agentId) => {
  if (!queryId || !agentId) {
    console.trace(
      "FAILED: cannot get query, because missing required parameter 'queryId', 'agentId'"
    );
    return;
  }
  return await DB.get({
    TableName: "Table1",
    IndexName: "agentId-PK-index",
    Key: {
      PK: queryId,
      agentId: agentId,
    },
  })
    .promise()
    .then((res) => {
      console.log(`SUCCESS: get query '${agentId}'.`);
      if (!res.Item) {
        return;
      }
      return {
        ...res?.Item,
        agentId: res?.Item?.agentId,
        queryId: res?.Item?.PK,
        createdAt: res?.Item?.createdAt,
        updatedAt: res?.Item?.updatedAt,
        customerId: res?.Item?.SK,
      };
    })
    .catch((err) => {
      console.trace(`FAILED: get query '${queryId}'. Because: `, err);
      // throw err;
      return;
    });
};

exports.customerGetQueryById = async (queryId, customerId) => {
  if (!queryId || !customerId) {
    console.trace(
      "FAILED: cannot get query, because missing required parameter 'queryId', 'customerId'"
    );
    return;
  }
  return await DB.get({
    TableName: "Table1",
    Key: {
      PK: queryId,
      SK: customerId,
    },
  })
    .promise()
    .then((res) => {
      console.log(`SUCCESS: get query '${customerId}'.`);
      if (!res.Item) {
        return;
      }
      return {
        ...res?.Item,
        customerId: res?.Item?.SK,
        queryId: res?.Item?.PK,
        createdAt: res?.Item?.createdAt,
        agentId: res?.Item?.agentId,
        updatedAt: res?.Item?.updatedAt,
      };
    })
    .catch((err) => {
      console.trace(`FAILED: get query '${queryId}'. Because: `, err);
      // throw err;
      return;
    });
};

exports.agentGetAllQueries = async (agentId) => {
  if (!agentId) {
    console.trace("received null value for required parameter 'agentId'");
    return;
  }
  return await DB.query({
    TableName: "Table1",
    IndexName: "agentId-PK-index",
    KeyConditionExpression: "agentId = :dyn1 AND begins_with(PK, :dyn2)",
    ExpressionAttributeValues: {
      ":dyn1": agentId,
      ":dyn2": "QUERY_",
    },
  })
    .promise()
    .then((res) => {
      console.log(`SUCCESS: get all queries for agent '${agentId}'.`);
      return {
        count: res.Count,
        queries: res?.Items?.map((item) => {
          return {
            queryId: item?.PK,
            agentId: item?.agentId,
            createdAt: item?.createdAt,
            updatedAt: item?.updatedAt,
            queryTitle: item?.queryTitle || "",
            queryStatus: item?.queryStatus,
            customerId: item?.SK,
          };
        }),
      };
    })
    .catch((err) => {
      console.trace(
        `FAILED: get all queries for agent '${agentId}'. Because: `,
        err
      );
      return;
    });
};

exports.customerGetAllQueries = async (customerId) => {
  if (!customerId) {
    console.trace("received null value for required parameter 'customerId'");
    return;
  }
  return await DB.query({
    TableName: "Table1",
    IndexName: "inverted-key-index",
    KeyConditionExpression: "SK = :dyn1 AND begins_with(PK, :dyn2)",
    ExpressionAttributeValues: {
      ":dyn1": customerId,
      ":dyn2": "QUERY_",
    },
  })
    .promise()
    .then((res) => {
      console.log(`SUCCESS: get all queries for customer '${customerId}'.`);
      return {
        count: res.Count,
        queries: res?.Items?.map((item) => {
          return {
            queryId: item?.PK,
            customerId: item?.SK,
            createdAt: item?.createdAt,
            updatedAt: item?.updatedAt,
            queryTitle: item?.queryTitle || "",
            queryStatus: item?.queryStatus,
            agentId: item?.agentId,
          };
        }),
      };
    })
    .catch((err) => {
      console.trace(
        `FAILED: get all queries for customer '${customerId}'. Because: `,
        err
      );
      return;
    });
};

exports.createQuery = async (customerId, queryTitle) => {
  if (!customerId || !queryTitle) {
    console.trace(
      "received null value for required parameter 'customerId', 'queryTitle'"
    );
    return;
  }
  let query = {
    PK: `QUERY_${uuid()}`,
    SK: customerId,
    queryTitle: queryTitle,
    queryStatus: "pending", // default status
    LSI1_SK: "pending",
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };
  return await DB.put({
    TableName: "Table1",
    Item: query,
  })
    .promise()
    .then((res) => {
      console.log(
        `SUCCESS: create query '${query.PK}' for customer '${customerId}'.`
      );

      return {
        ...res,
        queryId: query.PK,
        customerId: customerId,
      };
    })
    .catch((err) => {
      console.trace(
        `FAILED: create query '${query.PK}' for customer '${customerId}'. Because: `,
        err
      );
      return;
    });
};
exports.findQuery = async (queryId) => {
  if (!queryId) {
    console.trace("received null value for required parameter 'queryId'");
    return;
  }
  return await DB.query({
    TableName: "Table1",
    KeyConditionExpression: "PK = :dyn1 AND begins_with(SK, :dyn2)",
    ExpressionAttributeValues: {
      ":dyn1": queryId,
      ":dyn2": "CUS_",
    },
  })
    .promise()
    .then((res) => {
      console.log(`SUCCESS: find query '${queryId}'`);
      if (res.Count === 0) return;
      return {
        ...res?.Items[0],
        queryId: res?.Items?.[0]?.PK,
        customerId: res?.Items?.[0]?.SK,
      };
    })
    .catch((err) => {
      console.trace(`FAILED: find query '${queryId}'. Because: `, err);
      return;
    });
};
exports.assignQueryToAgent = async (queryId, agentId, query = {}) => {
  if (!queryId || !agentId) {
    console.trace(
      "received null value for required parameter 'queryId', 'agentId'"
    );
    return;
  }
  let dbQuery = {
    PK: queryId,
    SK: query?.customerId,
    queryTitle: query?.queryTitle,
    customerId: query?.customerId,
    createdAt: query?.createdAt,
    agentId: agentId,
  };
  return await DB.put({
    TableName: "Table1",
    Item: dbQuery,
  })
    .promise()
    .then((res) => {
      console.log(`SUCCESS: assign query '${query.PK}' to agent '${agentId}'.`);

      return {
        ...res,
        queryId: query.PK,
        agentId: agentId,
      };
    })
    .catch((err) => {
      console.trace(
        `FAILED: assign query '${query.PK}' to agent '${agentId}'. Because: `,
        err
      );
      return;
    });
};

exports.changeQueryStatus = async (queryId, customerId, newStatus) => {
  if (!queryId || !customerId || !newStatus) {
    console.trace(
      "received null value for required parameter 'queryId', 'customerId', 'newStatus'"
    );
    return;
  }
  // LSI1_SK-index will only be used for queryStatus
  return await DB.update({
    TableName: "Table1",
    UpdateExpression: "SET queryStatus = :upd1, LSI1_SK = :upd1",
    ExpressionAttributeValues: {
      ":upd1": newStatus,
      ":cdx1": customerId,
      ":cdx2": queryId,
    },
    Key: {
      PK: queryId,
      SK: customerId,
    },
    ConditionExpression: "SK = :cdx1 AND PK = :cdx2",
  })
    .promise()
    .then((res) => {
      console.log(`SUCCESS: update query status.`);
      return {
        customerId: customerId,
        queryId: queryId,
        queryStatus: newStatus,
      };
    })
    .catch((err) => {
      console.trace(`FAILED: update query status. Because: `, err);
      return;
    });
};

exports.scanAllQueries = async ({ searchString, queryStatus } = {}) => {
  let expressionAttributeValues = {};
  let filterExpression = "";
  if (searchString) {
    filterExpression = DB_UTILS.andConcatFilterExpression(
      filterExpression,
      "contains(queryTitle, :fex1)"
    );
    expressionAttributeValues[":fex1"] = searchString;
  }
  if (queryStatus) {
    filterExpression = DB_UTILS.andConcatFilterExpression(
      filterExpression,
      " queryStatus = :fex2"
    );
    expressionAttributeValues[":fex2"] = queryStatus;
  }
  return await DB.scan({
    TableName: "Table1",
    IndexName: "LSI1_SK-index",
    Limit: 500,
    ...(filterExpression && { FilterExpression: filterExpression }),
    ...(Object.keys(expressionAttributeValues).length > 0 && {
      ExpressionAttributeValues: expressionAttributeValues,
    }),
  })
    .promise()
    .then((res) => {
      return {
        count: res?.Count || 0,
        queries: res?.Items?.map((item) => {
          return { ...item, queryId: item?.PK, customerId: item?.SK };
        }),
      };
    })
    .catch((err) => {
      console.trace("FAILED: scan all queries.. Because: ", err);
      return;
    });
};