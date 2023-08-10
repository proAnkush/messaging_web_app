var express = require("express");
var router = express.Router();
const queryController = require("../controllers/queries");
/* GET users listing. */
router.get("/", queryController.getAllQueries);

router.get("/:queryId", async function (req, res) {
  if (queryId) {
    return res.status(401).send("no queryId in params");
  }
  let getQueryResponse = await queryTable.getById(queryId);
  return res.status(200).json({
    ...getQueryResponse.query,
    message: "get query success",
  });
});


module.exports = router;
