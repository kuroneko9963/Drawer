//
// app.js
//

const getApp = () => {

  return new Promise(async resolve => {

    const express = require('express');
    const path = require('path');
    const bodyParser = require('body-parser');
    const cookieParser = require('cookie-parser');
    const session = require('express-session');
    const logger = require('morgan');
    const sassMiddleware = require('node-sass-middleware');
    const errorHandler = require('./middlewares/error');
    
    const app = express();
  
    const indexRouter  = await require('./routes/index')();
    const drawerRouter = await require('./routes/drawer')();
    
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(sassMiddleware({
      src: path.join(__dirname, 'public'),
      dest: path.join(__dirname, 'public'),
      indentedSyntax: false, // true = .sass and false = .scss
      sourceMap: true
    }));
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(session({
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false,
        httpOnly: true
      }
    }));

    app.set('views', __dirname + '/public');
    app.set('view engine', 'ejs');
    
    app.use('/'      , indexRouter);
    app.use('/drawer', drawerRouter);
    
    app.use(errorHandler.code404);
    app.use(errorHandler.code5xx);

    resolve(app);
    
  });
  
};

module.exports = getApp;
