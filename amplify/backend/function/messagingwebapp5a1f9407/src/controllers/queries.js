const queriesTable = require("../db/query");

exports.getAllQueries = async (req, res) => {
  let { searchString, queryStatus } = req.query;
  let queries = await queriesTable.scanAllQueries({
    searchString,
    queryStatus,
  });
  if (!queries) return res.status(400).send("try to ease the filter");
  return res.status(200).json(queries);
};
