const {
  checkemail,
  addemail,
  activeemail,
  checkactiveemail,
  checkform,
  sendform,
  login,
  twofactorauth,
  checkloginstatus,
  checklogincode,
  addloginstatusfalse,
  addloginstatustrue,
  removecode,
  checkcreateemail,
  createaccount,
  checkoldpassword,
  changeoldpassword,
  checkregisteremail,
  resetpassword,
} = require("../controller/res.controller");
const router = require("express").Router();
// const { checkToken } = require("../../auth/token_validation");

router.post("/checkverifyemail", checkemail);
router.post("/addverifyemail", addemail);
router.post("/verifylink", activeemail);
router.post("/checkactiveemail", checkactiveemail);
router.post("/checkform", checkform);
router.post("/sendform", sendform);
router.post("/login", login);
router.post("/twofactorauth", twofactorauth);
router.get("/checkloginstatus", checkloginstatus);
router.post("/checklogincode", checklogincode);
router.post("/addloginstatusfalse", addloginstatusfalse);
router.post("/addloginstatustrue", addloginstatustrue);
router.post("/removecode", removecode);
router.post("/checkemail", checkcreateemail);
router.post("/create", createaccount);
router.post("/checkoldpassword", checkoldpassword);
router.post("/changepassword", changeoldpassword);
router.post("/checkregisteremail", checkregisteremail);
router.post("/resetpassword", resetpassword);

module.exports = router;
