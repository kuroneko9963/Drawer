var express = require('express');
var router = express.Router();

const connect = async() => {
  const DB = require('../db/database');
  return await DB.connect();
};

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Express',
  });
});

module.exports = router;
