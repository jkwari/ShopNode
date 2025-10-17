const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");

router.get("/login", authController.getLoginForm);

router.post("/login", authController.postLoginForm);

router.post("/logout", authController.postLogout);

module.exports = router;
