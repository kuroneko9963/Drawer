//
// index routes
//

const getRouter = () => {
  
  return new Promise(async resolve => {
    
    const express = require('express');
    const router = express.Router();

    const DB = await require('../db/database')('learn-pro-sys');
    
    const path = (fileName) => {
      return `common/views/${fileName}`;
    };
    
    // GET home
    router.get('/', function(req, res, next) {
      res.render(path('index'), {
        title: 'Learn-pro Web',
      });
    });

    router.get('/login', (req, res, next) => {
      if (req.session.contentsLogin) {
        res.status(200);
        res.redirect('/contents');
      }
      else {
        res.render(path('login'), {
          title: 'Learn-pro Web | Login'
        });
      }
    });

    router.post('/login', async(req, res, next) => {
      const result = (await DB.queryResult('select * from login'))[0];
      if (req.body.id === result.ID && req.body.pass === result.PASS) {
        if (req.body.remember) {
          req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 7; // 1 week
        }
        else {
          req.session.cookie.expires = false;
        }
        req.session.contentsLogin = true;
        res.status(200);
        res.redirect('/contents');
      }
      else {
        res.status(401);
        res.redirect('/login');
      }
    });

    router.get('/contents', (req, res, next) => {
      if (req.session.contentsLogin) {
        res.send('logged in');
      }
      else {
        res.send('WARNING :: NOT LOGIN');
      }
    });

    resolve(router);

  });

};

module.exports = getRouter;
