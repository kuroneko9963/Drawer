//
// error.js
//

const fs = require('fs');
const Boom = require('boom');

/**
 * エラーログを残す
 * @param {Boom<null>} error 発生したエラー
 */
const createErrorLog = async (error) => {
  
  return new Promise(async resolve => {
    const zeroPad = (number, length) => {
      return number.toString(10).padStart(length, '0');
    };
  
    let log = '';
    const date = new Date();
    const Y = date.getFullYear();
    const M = date.getMonth() + 1;
    const D = date.getDate();
    const date_ = `${zeroPad(Y, 4)}-${zeroPad(M, 2)}-${zeroPad(D, 2)}`;
    
    const Hour = date.getHours();
    const Min = date.getMinutes();
    const Sec = date.getSeconds();
    const time_ = `${zeroPad(Hour, 2)}:${zeroPad(Min, 2)}:${zeroPad(Sec, 2)}`;
    
    const stack = error.stack.replace(/(\\)/g, '/');
    const name = error.name;
    const info = error.output.payload.error;
    const msg = error.output.payload.message;
    const code = error.output.payload.statusCode;
    
    log += `DATE : ${date_}\n`;
    log += `TIME : ${time_}\n`;
    log += `ERROR: ${name}\n`;
    log += `INFO : ${msg}\n`;
    log += `CODE : returned ${code} - ${info}\n`;
    log += `STACK: ${stack}\n\n\n`;
  
    const Data = {
      DATE: date_,
      TIME: time_,
      ERROR: {
        statusCode: code,
        info,
        msg,
        name,
        stack
      },
    };
  
    const readFile = (path) => {
      return new Promise((resolve, reject) => {
        if (fs.existsSync(path)) {
          fs.readFile(path, 'utf-8', (err, data) => {
            if (err) reject(err);
            resolve(data);
          });
        }
        else resolve('');
      });
    };
  
    const writeFile = (path, data) => {
      return new Promise((resolve, reject) => {
        fs.writeFile(path, data, 'utf-8', err => {
          if (err) reject(err);
          resolve();
        });
      });
    };
  
    const createStringLogFile = (path) => {
      return new Promise(async resolve => {
        let temp = '';
        temp += (await readFile(path)) + log;
        await writeFile(path, temp);
        resolve();
      });
    };
  
    const createJSONLogFile = (path) => {
      return new Promise(async resolve => {
        let temp = '';
        temp += await readFile(path);
        if (!temp) temp += '{ "logs": [] }';
        temp = JSON.parse(temp);
        temp.logs.push(Data);
        await writeFile(path, JSON.stringify(temp, null, 4));
        resolve();
      });
    };

    const dir = 'logs';
    const logfile = 'server-error.log';
    const jsonfile = 'server-error-log.json';
    
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    
    await createStringLogFile(`${dir}/${logfile}`);
    await createJSONLogFile(`${dir}/${jsonfile}`);

    resolve();
  });
};

const errorHandler = {
  code404(req, res, next) {
    res.status(404);
    console.log(req.url);
    res.render('common/views/code404', {
      title: '404 Not Found',
      requestedURL: req.url
    });
  },
  code5xx(err, req, res, next) {
    if (res.headersSent) return next(err);
    if (!err.statusCode) err = Boom.boomify(err);
  
    if (err.isServer || err.statusCode >= 500) {
      // サーバーエラーなのでエラーログを残す
      createErrorLog(err).then(() => { console.log('created log file.'); });
    }

    res.status(err.statusCode || err.output.statusCode);
    res.render('common/views/code5xx', {
      title: 'Error'
    });
  }
};

module.exports = errorHandler;
