require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const generator = require("generate-password");

app.use(cors());
app.use(express.json());
// parse requests of content-type - application/json
app.use(bodyParser.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(morgan('dev'));
const resRouter = require("./api/researcher/router/res.router");
// const bcrypt = require("bcrypt");
app.use(cookieParser());

app.use("/", resRouter);

app.get("/generatepasswords", (req, res) => {
  // Generate some passwords
  const passwords = generator.generate({
    length: 20,
    numbers: true,
  });
  // Return them as json
  res.send(passwords);
});

// set port, listen for requests
module.exports = app.listen(process.env.APP_PORT, () => {
  console.log(`Server is running on port:`, process.env.APP_PORT);
});
