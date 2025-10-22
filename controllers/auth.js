const User = require("../models/user");
//  Sign up logic

exports.getSignUp = (req, res, next) => {
  res.render("auth/signup", {
    pageTitle: "Sign Up",
    path: "/signup",
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.postSignUp = (req, res, next) => {};

// Log in Logic
exports.getLoginForm = (req, res, next) => {
  // const loggedIn = req.get("Cookie").split("=")[1];

  res.render("auth/login", {
    pageTitle: "Login",
    path: "/login",
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.postLoginForm = (req, res, next) => {
  // This is our dummy user that we want to use for our entire application
  User.findById("68ed7150a3b785793ca98bec")
    .then((user) => {
      req.session.isLoggedIn = true;
      req.session.user = user;
      res.redirect("/");
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((error) => {
    if (error) {
      console.log(error);
    }
    res.redirect("/");
  });
};
