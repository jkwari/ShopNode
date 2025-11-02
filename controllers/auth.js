const User = require("../models/user");
const bcryptjs = require("bcryptjs");
const mailer = require("nodemailer");
const sendGrid = require("nodemailer-sendgrid-transport");

const transporter = mailer.createTransport(
  sendGrid({
    auth: {
      api_key:
        "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",
    },
  })
);
//  Sign up logic

exports.getSignUp = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/signup", {
    pageTitle: "Sign Up",
    path: "/signup",
    errorMessage: message,
  });
};

exports.postSignUp = (req, res, next) => {
  const email = req.body.email;
  const firstName = req.body.fn;
  const lastName = req.body.ln;
  const password = req.body.password;
  const confirmedPassword = req.body.cp;

  User.findOne({ email: email })
    .then((userDoc) => {
      // If the Email Exists in the Database we can't have duplicate Emails
      if (userDoc) {
        req.flash("error", "Email already exist");
        return res.redirect("/signup");
      }
      // number 12 the number of hashing this password will encounter
      return bcryptjs
        .hash(password, 12)
        .then((hasedPassword) => {
          // Create a new user and save it to the Database
          const user = new User({
            email: email,
            firstName: firstName,
            lastName: lastName,
            password: hasedPassword,
            cart: { items: [] },
          });
          return user.save();
        })
        .then(() => {
          res.redirect("/login");
          return transporter.sendMail({
            to: email,
            from: "shop@nodeshop.com",
            subject: "Welcome to node shop",
            html: "<h1>Welcome to node shop here you can find anything you want on tech</h1>",
          });
        })
        .catch((error) => {
          console.log(error);
        });
    })
    .catch((error) => {
      console.log(error);
    });
};

// Log in Logic
exports.getLoginForm = (req, res, next) => {
  // const loggedIn = req.get("Cookie").split("=")[1];

  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  res.render("auth/login", {
    pageTitle: "Login",
    path: "/login",
    errorMessage: message,
  });
};

exports.postLoginForm = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email: email })
    .then((user) => {
      if (user) {
        // If we have a user we need to check password if matches the stored one in the DB
        // Please note that Password in the DB is Hashed so we need to use a compare method
        // provided by bcrypt Library.
        // Also compare method will return a boolean value we store it in match

        bcryptjs
          .compare(password, user.password)
          .then((match) => {
            if (match) {
              // if there is a match between the given pass and the pass in the DB then
              // Establish a session and store the user info in the session
              req.session.isLoggedIn = true;
              req.session.user = user;
              return req.session.save((err) => {
                if (err) {
                  console.log(err);
                }
                res.redirect("/");
              });
            } else {
              // Problem with password then redirect to login page
              req.flash("error", "Invalid Email or Password");
              return res.redirect("/login");
            }
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        // If the email is not found in the database then redirect to login page
        req.flash("error", "Invalid Email or Password");
        return res.redirect("/login");
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.getReset = (req, res, next) => {
  res.render("auth/reset", {
    pageTitle: "Reset Password",
    path: "/reset",
  });
};

exports.postReset = (req, res, next) => {
  // we want to get the data the user entered in the form(Password and email).
  const newPass = req.body.cPass;
  const userEmail = req.body.email;
  // We want to find the user if exist then we want to hash it to protect the new password.
  User.findOne({ email: userEmail }).then((foundUser) => {
    if (!foundUser) {
      req.flash("error", "Email Does Not Exist");
      res.redirect("/reset");
    } else {
      bcryptjs
        .hash(newPass, 12)
        .then((hashedNewPassword) => {
          // update the password field in the database with our new password.
          return User.updateOne(
            { email: userEmail },
            {
              $set: {
                password: hashedNewPassword,
              },
            }
          )
            .then((result) => {
              if (result) {
                console.log("update Successfully!!!!");
                res.redirect("/login");
              }
            })
            .catch((error) => {
              console.log(
                "This error is coming from updateOne Execution " + error
              );
            });
        })
        .catch((error) => {
          console.log(error);
        });
    }
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
