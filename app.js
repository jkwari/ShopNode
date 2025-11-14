const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDbStore = require("connect-mongodb-session")(session);
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const store = new MongoDbStore({
  uri: process.env.MONGODB_URI,
  collection: "sessions",
});

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

const errorController = require("./controllers/error");
const User = require("./models/user");

const csrf = require("csurf");
const flash = require("connect-flash");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", "views");

const csrfProtection = csrf();

// JWT Global Auth Check
app.use((req, res, next) => {
  const token = req.cookies.refreshToken;
  if (!token) {
    res.locals.isAuthenticated = false;
    return next();
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Are we reaching here");

    res.locals.isAuthenticated = true;
    req.user = { id: payload.userId, role: payload.role };
    console.log("Print the user Details: " + req.user);
  } catch {
    res.locals.isAuthenticated = false;
  }
  next();
});

app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  // if we are not log in we don't excute the code below this if statement;
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((error) => {
      console.log(error);
    });
});

app.use((req, res, next) => {
  // NO NEED TO SET isAuthenticated here manually now it is being handled
  // in middleware/isAuth.js file
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected !!!!!");
    app.listen(3000);
  })
  .catch((error) => {
    console.log(error);
  });
