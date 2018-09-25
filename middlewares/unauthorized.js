//
// unauthorized.js
//

const unauthorized = (req, res, next) => {
  if (req.url !== '/' && req.url !== '/login') {
    if (!req.session.contentsLogin) {
      res.redirect('/');
    }
    else next();
  }
  else next();
};

module.exports = unauthorized;
