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
    router.get('/', (req, res, next) => {
      res.render(path('/index'), {
        title: 'Drawer',
        logged_in: false,
        page: 'top',
        opt: {}
      });
    });

    resolve(router);

  });

};

module.exports = getRouter;
