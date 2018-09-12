var express = require('express');
var router = express.Router();

const connect = async () => {
  const DB = require('../db/database');
  return await DB.connect();
};

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
