const {
  checkverifyemail,
  addverifyemail,
  activeemail,
  getactiveemail,
  sendform,
  twofactorauth,
  loginstatus,
  checklogincode,
  loginstatustrue,
  loginstatusfalse,
  removecode,
  create,
  changepassword,
} = require("../service/res.service");
const { genSaltSync, hashSync, compareSync } = require("bcrypt");
const { sign } = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const passwordValidator = require("password-validator");
const generator = require("generate-password");

let smtpTransport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EM_USE,
    pass: process.env.EM_PASS,
  },
});

module.exports = {
  checkemail: (req, res) => {
    const email = req.body.email;
    checkverifyemail(email, (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      if (results) {
        if (results.active == "true") {
          return res.json({
            success: 0,
            message: "Email is verified",
          });
        }
        if (results.active == null) {
          return res.json({
            success: 0,
            message: "Email is not verified",
          });
        }
      } else {
        return res.json({
          success: 1,
          message: "Email could be verified",
        });
      }
    });
  },

  addemail: (req, res) => {
    const email = req.body.email;
    const verify =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    const link = "http://" + "localhost:3000" + "/verifylink/" + verify;
    const mailOption = {
      to: email,
      subject: "Please confirm your Email account",
      html:
        "Hello researchers,<br><br> Please Click on the link to verify your email.<br><a href=" +
        link +
        ">Click here to verify your email</a><br><br>Kind regards, <br>Coronavirus Rapid Test Data Platform</br>",
    };
    addverifyemail(email, verify, (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      if (results) {
        smtpTransport.sendMail(mailOption, (err, info) => {
          if (err) {
            res.send({ message: err });
          } else {
            return res.json({
              success: 1,
              message: "Email sent",
            });
          }
        });
      }
    });
  },

  activeemail: (req, res) => {
    const id = req.body.id;
    activeemail(id, (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      return res.json({
        success: 1,
        message: "Email activation successful",
      });
    });
  },

  checkactiveemail: (req, res) => {
    const id = req.body.id;
    getactiveemail(id, (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      if (results) {
        if (results.active == "true") {
          return res.json({
            success: 1,
            message: "Email is verified",
            data: results.email,
          });
        }
        if (results.active == null) {
          return res.json({
            success: 1,
            message: "Email is not verified",
            data: results.email,
          });
        }
      } else {
        return res.json({
          success: 0,
          message: "Email is null",
        });
      }
    });
  },

  checkform: (req, res) => {
    const body = req.body.email;
    checkverifyemail(body, (err, results) => {
      if (err) {
        console.log(err);
        return;
      } else {
        if (results) {
          if (results.active == null) {
            return res.json({
              success: 0,
              message: "Email is not verified",
            });
          }
          if (results.active == "true" && results.firstname != null) {
            return res.json({
              success: 0,
              message: "Your data has been sent to admin",
            });
          }
          if (results.active == "true" && results.firstname == null) {
            return res.json({
              success: 1,
              message: "Email can be sent",
            });
          }
        }
        if (!results) {
          return res.json({
            success: 0,
            message: "Email not found",
          });
        }
      }
    });
  },

  sendform: (req, res) => {
    const mailOption = {
      to: "kingzuzu96@gmail.com",
      subject: "Please verify researcher's information",
      html:
        "Hello administrator,<br><br>Please check the following information<br>" +
        "Email: " +
        req.body.email +
        "<br>" +
        "First Name: " +
        req.body.firstName +
        "<br>" +
        "Last Name: " +
        req.body.lastName +
        "<br>" +
        "Phone Number: " +
        req.body.phonenumber +
        "<br>" +
        "Company Name: " +
        req.body.companyname +
        "<br>" +
        "Company URL: " +
        req.body.companyurl +
        "<br>" +
        "Company Position: " +
        req.body.companyposition +
        "<br><br>" +
        "King regards, " +
        "<br>" +
        "Coronavirus Rapid Test Data Platform",
    };

    const email = req.body.email;
    const firstname = req.body.firstName;
    const lastname = req.body.lastName;

    sendform(firstname, lastname, email, (err, results) => {
      if (err) {
        console.log(err);
        return;
      }

      smtpTransport.sendMail(mailOption, (err, info) => {
        if (err) {
          res.send({ message: err });
        } else {
          return res.json({
            success: 1,
            message: "Email sent",
          });
        }
      });
    });
  },

  login: (req, res) => {
    const body = req.body;
    checkverifyemail(body.email, (err, results) => {
      if (err) {
        console.log(err);
      }
      if (!results) {
        return res.json({
          success: 0,
          message: "Invalid email",
        });
      }
      const result = compareSync(body.password, results.password);
      if (result) {
        results.password = undefined;
        const jsontoken = sign({ result: results }, process.env.JWT_KEY, {
          expiresIn: "24h",
        });
        return res.json({
          success: 1,
          message: "login successfully",
          token: jsontoken,
        });
      } else {
        return res.json({
          success: 0,
          message: "Invalid password",
        });
      }
    });
  },

  twofactorauth: (req, res) => {
    const logincode = Math.floor(Math.random() * 10000000 + 1);
    const mailOption = {
      to: req.body.email,
      subject: "Please copy the verification code to login the web platform",
      html:
        "Please copy the verification code to login the web platform<br>" +
        "Verification code: " +
        logincode,
    };

    const email = req.body.email;
    twofactorauth(logincode, email, (err, results) => {
      if (err) {
        console.log(err);
        return;
      }

      smtpTransport.sendMail(mailOption, (err, info) => {
        if (err) {
          res.send({ message: err });
        } else {
          return res.json({
            success: 1,
            message: "Email sent",
          });
        }
      });
    });
  },

  checkloginstatus: (req, res) => {
    loginstatus((err, results) => {
      if (err) {
        console.log(err);
        return;
      } else {
        return res.json({
          success: 1,
          message: "login status",
          data: results,
        });
      }
    });
  },

  checklogincode: (req, res) => {
    const body = req.body;
    checklogincode(body.email, (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      if (results) {
        return res.json({
          success: 1,
          message: "Correct code",
          data: results,
        });
      } else {
        res.send({ message: "Email is null" });
      }
    });
  },

  addloginstatusfalse: (req, res) => {
    const email = req.body.email;
    loginstatusfalse(email, (err, results) => {
      if (err) {
        console.log(err);
        return;
      } else {
        res.send({ message: "No login" });
      }
    });
  },

  addloginstatustrue: (req, res) => {
    const email = req.body.email;
    loginstatustrue(email, (err, results) => {
      if (err) {
        console.log(err);
        return;
      } else {
        res.send({ message: "login" });
      }
    });
  },

  removecode: (req, res) => {
    const logincode = "NULL";
    const email = req.body.email;
    removecode(logincode, email, (err, results) => {
      if (err) {
        console.log(err);
        return;
      } else {
        return res.json({
          success: 1,
          message: "code remove",
        });
      }
    });
  },

  checkcreateemail: (req, res) => {
    const body = req.body.email;
    checkverifyemail(body, (err, results) => {
      if (err) {
        console.log(err);
        return;
      } else {
        if (results) {
          if (results.password == null) {
            return res.json({
              success: 1,
              message: "Account can be created",
            });
          } else {
            return res.json({
              success: 0,
              message: "Account has been created",
            });
          }
        }
        if (!results) {
          return res.json({
            success: 0,
            message: "Wrong email",
          });
        }
      }
    });
  },

  createaccount: (req, res) => {
    const mailOption = {
      to: req.body.email,
      subject: "Account creation successful",
      html:
        "Hello researcher,<br><br>Your account was successfully created by adminstrator.<br>" +
        "Your login email is: " +
        req.body.email +
        "<br>" +
        "Your login password is: " +
        req.body.password +
        "<br><br>" +
        "Kind regards" +
        "<br>" +
        "Coronavirus Rapid Test Data Platform",
    };

    const body = req.body;
    const salt = genSaltSync(10);
    body.password = hashSync(body.password, salt);

    create(body.password, body.companyname, body.email, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: 0,
          message: "Database connection errror",
        });
      }
      smtpTransport.sendMail(mailOption, (err, info) => {
        if (err) {
          res.send({ message: err });
        } else {
          return res.json({
            success: 1,
            message: "Account was successfully created",
          });
        }
      });
    });
  },

  checkoldpassword: (req, res) => {
    const body = req.body;
    checkverifyemail(body.email, (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      if (results) {
        if (results.password != null) {
          const result = compareSync(body.password, results.password);
          if (result == true) {
            return res.json({
              success: 1,
              message: "Correct password",
            });
          } else {
            return res.json({
              success: 0,
              message: "Wrong password",
            });
          }
        }
      }
    });
  },

  changeoldpassword: (req, res) => {
    const body = req.body;
    const schema = new passwordValidator();
    // Add properties to it
    schema
      .is()
      .min(8) // Minimum length 8
      .is()
      .max(20) // Maximum length 100
      .has()
      .uppercase() // Must have uppercase letters
      .has()
      .lowercase() // Must have lowercase letters
      .has()
      .digits(2) // Must have at least 2 digits
      .has()
      .not()
      .spaces(); // Should not have spaces

    if (schema.validate(body.password, { list: true }).includes("min")) {
      return res.json({
        success: 0,
        message: "Minimum length 8",
      });
    }
    if (schema.validate(body.password, { list: true }).includes("max")) {
      return res.json({
        success: 0,
        message: "Maxmum length 20",
      });
    }
    if (schema.validate(body.password, { list: true }).includes("uppercase")) {
      return res.json({
        success: 0,
        message: "Must have uppercase letters",
      });
    }
    if (schema.validate(body.password, { list: true }).includes("lowercase")) {
      return res.json({
        success: 0,
        message: "Must have lowercase letters",
      });
    }
    if (schema.validate(body.password, { list: true }).includes("digits")) {
      return res.json({
        success: 0,
        message: "Must have at least 2 digits",
      });
    }
    const salt = genSaltSync(10);
    body.password = hashSync(body.password, salt);
    changepassword(body.password, body.email, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: 0,
          message: "Database connection errror",
        });
      }
      return res.json({
        success: 1,
        message: "Password has been changed",
      });
    });
  },

  checkregisteremail: (req, res) => {
    const body = req.body;
    checkverifyemail(body.email, (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      if (results) {
        if (results.password != null) {
          return res.json({
            success: 1,
            message: "Password can be reset",
          });
        } else {
          return res.json({
            success: 0,
            message: "Wrong email",
          });
        }
      } else {
        return res.json({
          success: 0,
          message: "Wrong email",
        });
      }
    });
  },

  resetpassword: (req, res) => {
    const body = req.body;
    body.password = generator.generate({
      length: 20,
      numbers: true,
    });

    const mailOption = {
      to: req.body.email,
      subject: "Password has been reset",
      html:
        "Hello researcher,<br><br>Your passowrd has been reset successfully.<br>" +
        "Your login password is: " +
        body.password +
        "<br><br>" +
        "Kind regards" +
        "<br>" +
        "Coronavirus Rapid Test Data Platform",
    };
    
    const salt = genSaltSync(10);
    body.password = hashSync(body.password, salt);

    changepassword(body.password, body.email, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: 0,
          message: "Database connection errror",
        });
      }
      smtpTransport.sendMail(mailOption, (err, info) => {
        if (err) {
          res.send({ message: err });
        } else {
          return res.json({
            success: 1,
            message: "Password has been reset",
          });
        }
      });
    });
  },
};
