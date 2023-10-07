var express = require('express');
var router = express.Router();
const allquery = require('../queries/query');
const {unmarshall} = require("@aws-sdk/util-dynamodb");


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' }); 
});


// GET request to return all accounts by a particular user
// takes in a particular user_id
router.get('/allaccounts', async(req,res) => {
  console.log(req.body);
  const userId = req.body.userId;
  allquery.getAllAccounts(userId)
  .then((results) => {
    console.log("Results: ", results);
    if (results.length==0) {
      res.status(400).json({
        "code" : 400,
        "data": results,
        "message": "No records found."
      })
    }
    res.status(200).json({
      "code" : 200,
      "data": results,
      "message": "Success"
    });
  })
  .catch((error) => {
    console.log(error);
    res.status(500).json({
      "code" : 500,
      "data": [],
      "message": error.message
    });
  })
})

// GET request to return details of a particular account
// takes in a particular points account's id
router.get('/accdetails', async (req,res) => {
  console.log(req.body);
  const mainId = req.body.mainId;
  /* The code is making a GET request to the '/points' endpoint and calling the `getPointsBalance`
  function from the `allquery` module. */
  allquery.getPointsBalance(mainId)
  .then((results) => {
    console.log("Results: ", results);
    if (!results.Item){
      res.status(400).json({
        "code" : 400,
        "data": results,
        "message": "No record of points account found."
      })
    }
    const returnres = unmarshall(results.Item);
    res.status(200).json({
      "code" : 200,
      "data" : returnres,
      "message" : "Success"
    });
  })
  .catch((error) => {
    console.log(error);
    res.status(500).json({
      "code" : 500,
      "data" : [],
      "message" : error.message
    });
  })
  // try {
  //   const params = {
  //     TableName: 'points_ledger',
  //     KeyConditionExpression: "id = :id",
  //     ExpressionAtttributeValues:{
  //       // ":id": req.query.id
  //       ":id": "2f5687c7-af51-4d79-9a38-9eef5a3c42b8"
  //     }
  //   }
  //   const result = await docClient.query(params).promise();
  //   console.log(result);
  //   res.status(200).json(result)
  // }
  // catch(error) {
  //   console.log(error);
  // }
})

// GET request to return if a particular account exists
// takes in a particular points account's id
router.get('/validate', async (req,res) => {
  console.log(req.body);
  const mainId = req.body.mainId;
  /* The code is making a GET request to the '/points' endpoint and calling the `getPointsBalance`
  function from the `allquery` module. */
  allquery.pointsAccExist(mainId)
  .then((results) => {
    console.log(results);
    res.send(results);
  })
  .catch((error) => {
    console.log(error);
    res.status(500).json({
      "code" : 500,
      "data" : [],
      "message" : error.message
    });
  })
})

// PUT request to update balance of a particular account
// takes in a particular points account's id and new balance 
// sample input = {"mainId": "2f5687c7-af51-4d79-9a38-9eef5a3c42b8","newbalance": 5000}
router.put('/updatebalance', async (req,res) => {
  console.log(req.body);
  const mainId = req.body.mainId;
  const balance = req.body.newbalance;
  allquery.pointsAccExist(mainId)
  .then((results) => {
    if (results){
      allquery.updatePoints(mainId,balance)
      .then((newresults) => {
        const status = newresults.$metadata.httpStatusCode;
        if (status == 200) {
          res.status(200).json({
            "code" : 200,
            "data" : newresults,
            "message" : "Update Success"
          });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          "code" : 500,
          "data" : [],
          "message" : err.message
        });
      })
    }
    else {
      res.status(400).json({
        "code" : 400,
        "data" : [],
        "message" : "No record of points account found."
      })
    }
  })
  .catch((error) => {
    console.log(error);
    res.status(500).json({
      "code" : 500,
      "data" : [],
      "message" : error.message
    });
  })
})

module.exports = router;
