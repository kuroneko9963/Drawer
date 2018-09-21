//
// index routes
//

const getRouter = () => {
  
  return new Promise(resolve => {
    
    const express = require('express');
    const router = express.Router();
    
    const path = (fileName) => {
      return `common/views/${fileName}`;
    };
    
    // GET home
    router.get('/', function(req, res, next) {
      res.render(path('index'), {
        title: 'Express',
      });
    });

    resolve(router);

  });

};

module.exports = getRouter;
