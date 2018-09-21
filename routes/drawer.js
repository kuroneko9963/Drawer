//
// Drower routes
//

const getRouter = () => {

  return new Promise(async resolve => {

    const express = require('express');
    const router = express.Router();
    
    const DB = await require('../db/database')('drawer');
  
    const path = (fileName) => {
      return `drawer/views/${fileName}`;
    };
    
    // GET home
    router.get('/', async(req, res, next) => {
      res.render(path('/index'), {
        title: 'Drawer',
        tables: JSON.stringify(await DB.queryResult('show tables'), null, 4).replace(/\ /g, '&nbsp;').replace(/\n/g, '<br>')
      });
    });

    resolve(router);

  });

};

module.exports = getRouter;
