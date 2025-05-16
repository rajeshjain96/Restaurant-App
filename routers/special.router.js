const express = require("express");
const jwt = require("jsonwebtoken");
const SECRET_KEY = "aaappuuqq";
const router = express.Router();

router.get("/welcome", async (req, res) => {
    
  // check whether session is assigned or not
  let token = req.cookies.token;
  if (!token) {
    // assign session/token
    let obj = { role: "guest", name: "guest" };
    token = jwt.sign(obj, SECRET_KEY, { expiresIn: "1h" });
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // Set to true in production with HTTPS
      sameSite: "Lax",
      maxAge: 3600000,
    });
    res.json({ result: "done" });
  } else {
    res.json({ result: "alreadyDone" });
  }
});

module.exports = router;
