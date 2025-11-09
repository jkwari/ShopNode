const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");

router.get("/login", authController.getLoginForm);

router.post("/login", authController.postLoginForm);

router.post("/logout", authController.postLogout);

router.get("/signup", authController.getSignUp);

router.post("/signup", authController.postSignUp);

router.get("/reset", authController.getReset);

// router.post("/reset", authController.postReset);

module.exports = router;
