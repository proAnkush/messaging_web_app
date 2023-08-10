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
      // throw err;
      return;
    });
};

/**
 *
 * @param {String} customerId example : CUS_123
 */
exports.getById = async (customerId) => {
  if (!customerId) {
    console.trace(
      "FAILED: cannot get customer profile, because missing required parameter 'customerId'"
    );
    return;
  }
  return await DB.get({
    TableName: "Table1",
    Key: {
      PK: customerId,
      SK: "PROFILE",
    },
  })
    .promise()
    .then((res) => {
      console.log(`SUCCESS: get customer '${customerId}'.`);
      if (!res.Item) {
        return;
      }
      return {
        customerId: res?.Item?.PK,
        phone: res?.Item?.phoneNumber,
        name: res?.Item?.name,
        createdAt: res?.Item?.createdAt,
        updatedAt: res?.Item?.updatedAt,
      };
    })
    .catch((err) => {
      console.trace(`FAILED: get customer '${customerId}'. Because: `, err);
      // throw err;
      return;
    });
};
exports.getAllCustomers = async () => {
  return await DB.query({
    TableName: "Table1",
    IndexName: "inverted-key-index",
    KeyConditionExpression: "SK = :dyn1 AND begins_with(PK, :dyn2)",
    ExpressionAttributeValues: {
      ":dyn1": "PROFILE",
      ":dyn2": "CUS_",
    },
  })
    .promise()
    .then((res) => {
      console.log("SUCCESS: get all customers");
      return {
        count: res.Count,
        customers: res?.Items?.map((item) => {
          return {
            customerId: item?.PK,
            name: item?.name,
            phone: item?.phoneNumber,
          };
        }),
      };
    })
    .catch((err) => {
      console.trace("FAILED: get all customers. Because: ", err);
      return;
    });
};
exports.getCustomerByPhone = async (phone) => {
  if (!phone) {
    console.trace(
      "FAILED: cannot get customer profile, because missing required parameter 'phone'"
    );
    return;
  }
  return DB.query({
    TableName: "Table1",
    IndexName: "phoneNumber-PK-index",
    KeyConditionExpression: "phoneNumber = :dyn1 AND begins_with(PK, :dyn2)",
    ExpressionAttributeValues: {
      ":dyn1": DB_UTILS.tryAddCountryCode(phone),
      ":dyn2": "CUS_",
    },
    Limit: 1,
  })
    .promise()
    .then((res) => {
      console.log(`SUCCESS: find customer by phone '${phone}'`, res);
      if (res.Count === 0) return;
      return {
        ...res?.Items?.[0],
        name: res?.Items?.[0].name,
        phoneNumber: res?.Items?.[0].phoneNumber,
      };
    })
    .catch((err) => {
      console.trace(
        `FAILED: find customer by phone '${phone}'. Because: `,
        err
      );
      return;
    });
};
