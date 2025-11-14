const User = require("../models/user");
const bcryptjs = require("bcryptjs");
const mailer = require("nodemailer");
const sendGrid = require("nodemailer-sendgrid-transport");
const { signAccessToken, refershToken, verifyToken } = require("../util/token");

const transporter = mailer.createTransport(
  sendGrid({
    auth: {
      api_key: process.env.SENDGRID_API_KEY,
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
  const role = req.body.role;

  User.findOne({ email: email })
    .then((userDoc) => {
      // If the Email Exists in the Database we can't have duplicate Emails
      if (userDoc) {
        req.flash("error", "Email already exist");
        return res.redirect("/signup");
      }
      // number 12 the number of hashing this password will encounter
      return bcryptjs
        .hash(password, 12) // 12 is the salt
        .then((hasedPassword) => {
          // Create a new user and save it to the Database
          const user = new User({
            email: email,
            firstName: firstName,
            lastName: lastName,
            password: hasedPassword,
            role: role,
            cart: { items: [] },
          });
          return user.save();
        })
        .then(() => {
          res.redirect("/login");
          return transporter.sendMail({
            to: email,
            from: "jamalwari2@gmail.com",
            subject: "Welcome to node shop",
            html: "<h1>Welcome to node shop here you can find anything you want on tech</h1> <br> <p>This is a testing email for the user who needs to login</p>",
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
          .compare(password, user.password) // this method will decypt the pass in the database and then compare it with the one the user provided
          .then((match) => {
            if (match) {
              // if there is a match between the given pass and the pass in the DB then
              // We need to establish JWT token and this token will verify the user in each
              // operation he/she does in the website
              // 1. We need to create the payload that has some info for me personally i want to store the user name and role
              const payload = { id: user._id, role: user.role };
              const accessToken = signAccessToken(payload);
              const tokenRefresh = refershToken(payload);

              // 2. We need to save the refresh token in the database
              user.refershToken = tokenRefresh;
              user
                .save()
                .then(() => {
                  console.log("Refresh Token Added to Database!!!");
                })
                .catch((error) => {
                  console.log(error);
                });
              res.cookie("refreshToken", tokenRefresh, {
                httpOnly: true,
                sameSite: "lax",
                secure: process.env.COOKIE_SECURE === "true",
                maxAge: 7 * 24 * 60 * 60 * 1000, // to match REFRESH_TOKEN_EXPIRES_IN
              });

              res.redirect("/");
              // res.json({
              //   accessToken,
              //   user: {
              //     id: user._id,
              //     email: user.email,
              //     role: user.role,
              //   },
              // });
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

exports.getRefreshToken = (req, res, next) => {
  const token = req.cookies.refershToken;
  if (!token) {
    return res.status(401).json({ message: "NO REFRESH TOKEN PROVIDED" });
  }
  // here there is a token

  let payload;
  try {
    payload = verifyToken(token); // here we need to verify the token with the secret
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Invalid or expired refresh token " });
  }
  User.findById(payload.id).then((user) => {
    if (!user || user.refreshToken !== token) {
      res.status(401).json({ message: "Refresh Token not recognized" });
    }
    const newPayload = { id: user.id, role: user.role };
    const newAccessToken = signAccessToken(newPayload);
    const newRefreshToken = refershToken(newPayload);

    user.refreshToken = newRefreshToken;
    return user
      .save()
      .then(() => {
        res.cookie("refreshToken", newRefreshToken, {
          httpOnly: true,
          sameSite: "lax",
          secure: process.env.COOKIE_SECURE === "true",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.json({
          accessToken: newAccessToken,
        });
      })
      .catch((error) => {
        res.status(401).json({ mesaage: "Server Error", error: error.message });
      });
  });
};

exports.getReset = (req, res, next) => {
  res.render("auth/reset", {
    pageTitle: "Reset Password",
    path: "/reset",
  });
};

// exports.postReset = (req, res, next) => {
//   // we want to get the data the user entered in the form(Password and email).
//   const newPass = req.body.cPass;
//   const userEmail = req.body.email;
//   // We want to find the user if exist then we want to hash it to protect the new password.
//   User.findOne({ email: userEmail }).then((foundUser) => {
//     if (!foundUser) {
//       req.flash("error", "Email Does Not Exist");
//       res.redirect("/reset");
//     } else {
//       bcryptjs
//         .hash(newPass, 12)
//         .then((hashedNewPassword) => {
//           // update the password field in the database with our new password.
//           return User.updateOne(
//             { email: userEmail },
//             {
//               $set: {
//                 password: hashedNewPassword,
//               },
//             }
//           )
//             .then((result) => {
//               if (result) {
//                 console.log("update Successfully!!!!");
//                 res.redirect("/login");
//               }
//             })
//             .catch((error) => {
//               console.log(
//                 "This error is coming from updateOne Execution " + error
//               );
//             });
//         })
//         .catch((error) => {
//           console.log(error);
//         });
//     }
//   });
// };

exports.postLogout = (req, res, next) => {
  // OLD CODE
  // req.session.destroy((error) => {
  //   if (error) {
  //     console.log(error);
  //   }
  //   res.redirect("/");
  // });

  const token = req.cookies.refreshToken;
  if (!token) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.COOKIE_SECURE === "true",
    });
    return res.json({ message: "logged out successfully" });
  }
  let payload;
  try {
    payload = verifyToken(token);
  } catch (error) {
    payload = null;
  }
  if (!payload) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.COOKIE_SECURE === "true",
    });
    return res.json({ message: "logged out Successfully" });
  }
  User.findById(payload.id)
    .then((user) => {
      if (!user) {
        res.clearCookie("refreshToken");
        return res.json({ message: "Logged out Successfully" });
      }
      user.refreshToken = null;
      user
        .save()
        .then(() => {
          res.clearCookie("refreshToken", {
            httpOnly: true,
            sameSite: "lax",
            secure: proccess.env.COOKIE_SECURE === "true",
          });
          res.json({ message: "Logged Out Successfully" });
        })
        .catch((error) => {
          res
            .status(401)
            .json({ message: "Error in saving ", error: error.message });
        });
    })
    .catch((error) => {
      res.status(401).json({ message: "Server Error:", error: error.message });
    });
};
