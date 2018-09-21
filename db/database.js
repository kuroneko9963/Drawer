//
// database.js
//

const Mysql = require('mysql');
const env = process.env.NODE_ENV || 'development';
const dbconfig = require('./dbconfig.json');

const connection = {
  drawer: null
};

const connectDB = (content) => {
  return new Promise((resolve, reject) => {
    const connect = Mysql.createConnection(dbconfig[content][env]);
    connect.connect(err => {
      if (err) reject(err);
      connection[content] = connect;
      resolve();
    });
  });
};

const getConnection = (content) => {
  return new Promise(async(resolve, reject) => {
    if (typeof connection[content] === 'undefined') {
      reject(new Error(`content: ${content} is not found.`));
    }
    else if (connection[content] === null) {
      await connectDB(content);
    }
    resolve(connection[content]);
  });
};

const DataBase = async(content) => {
  return {
    connect: await getConnection(content),
    queryResult(query) {
      return new Promise((resolve, reject) => {
        this.connect.query(query, (err, result) => {
          if (err) reject(err);
          resolve(result);
        });
      });
    }
  };
};

module.exports = DataBase;
