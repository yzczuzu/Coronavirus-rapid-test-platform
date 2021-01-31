const db = require("../../../database/database");

module.exports = {
  checkverifyemail: (email, callback) => {
    db.query(
      "SELECT * FROM Researcher WHERE email = ?",
      [email],
      (error, results, fields) => {
        if (error) {
          callback(error);
        }
        return callback(null, results[0]);
      }
    );
  },

  addverifyemail: (email, verify, callback) => {
    db.query(
      "INSERT INTO Researcher(email, verification) values(?,?)",
      [email, verify],
      (error, results, fields) => {
        if (error) {
          callback(error);
        }
        return callback(null, results);
      }
    );
  },

  activeemail: (id, callback) => {
    db.query(
      "UPDATE Researcher SET active = ? WHERE verification = ?",
      ["true", id],
      (error, results, fields) => {
        if (error) {
          callback(error);
        } else {
          return callback(null, results[0]);
        }
      }
    );
  },

  getactiveemail: (verify, callback) => {
    db.query(
      "SELECT email, active FROM Researcher WHERE verification = ?",
      [verify],
      (error, results, fields) => {
        if (error) {
          callback(error);
        }
        return callback(null, results[0]);
      }
    );
  },

  sendform: (firstname, lastname, email, callback) => {
    db.query(
      "UPDATE Researcher SET firstname = ?, lastname = ? WHERE email = ?",
      [firstname, lastname, email],
      (error, results, fields) => {
        if (error) {
          callback(error);
        } else {
          return callback(null, results[0]);
        }
      }
    );
  },

  twofactorauth: (logincode, email, callBack) => {
    db.query(
      "UPDATE Researcher SET logincode = ? WHERE email = ?",
      [logincode, email],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  },

  loginstatus: (callBack) => {
    db.query("SELECT * FROM Researcher", (error, results, fields) => {
      if (error) {
        callBack(error);
      }
      return callBack(null, results);
    });
  },

  checklogincode: (email, callBack) => {
    db.query(
      "SELECT logincode FROM Researcher WHERE email = ?",
      [email],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  },

  loginstatusfalse: (email, callBack) => {
    db.query(
      "UPDATE Researcher SET loginstatus = ? WHERE email = ?",
      ["false", email],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  },

  loginstatustrue: (email, callBack) => {
    db.query(
      "UPDATE Researcher SET loginstatus = ? WHERE email = ?",
      ["true", email],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  },

  removecode: (logincode, email, callBack) => {
    db.query(
      "UPDATE Researcher SET logincode = ? WHERE email = ?",
      [logincode, email],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  },

  create: (password, companyname, email, callBack) => {
    db.query(
      "UPDATE Researcher SET password = ?, companyname = ? WHERE email = ?",
      [password, companyname, email],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  },

  changepassword: (password, email, callBack) => {
    db.query(
      "UPDATE Researcher SET password = ? WHERE email = ?",
      [password, email],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  },
};
