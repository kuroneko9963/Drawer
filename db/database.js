//
// database.js
//

const Mysql = require('mysql');
const app = require('../app');
const dbconfig = require('./dbconfig.json')[app.get('env')];

const DataBase = {
  connection: null,
  connect() {
    const self = this;
    return new Promise((resolve, reject) => {
      if (self.connection) {
        resolve(self);
        return;
      }
      const connection = Mysql.createConnection(dbconfig);
      connection.connect(err => {
        if (err) reject(err);
        self.connection = connection;
        resolve(self);
      });
    });
  },
  queryResult(query) {
    return new Promise((resolve, reject) => {
      if (!this.connection) reject(new Error('Mysql is disconnected.'));
      this.connection.query(query, (error, result) => {
        if (error) reject(error);
        resolve(result);
      });
    });
  }
};

module.exports = DataBase;
