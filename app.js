const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongodb = require("mongodb");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDbStore = require("connect-mongodb-session")(session);
const MONGODB_URI =
  "mongodb+srv://JKW:z4dFjSmIzzwK6RVD@cluster0.jzrmoxo.mongodb.net/store?&w=majority&appName=Cluster0";

const store = new MongoDbStore({
  uri: MONGODB_URI,
  collection: "sessions",
});

const errorController = require("./controllers/error");
const User = require("./models/user");

const app = express();

// Since execute function is a promise function which deals with ASYNC code
// We can use .then(). catch()
// db.execute("SELECT * FROM products")
//   .then((result) => {
//     console.log(result);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

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

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          username: "Jamal Wari",
          email: "jamalwari@gmail.com",
          cart: { items: [] },
        });

        user.save();
      }
    });

    console.log("Connected !!!!!");
    app.listen(3000);
  })
  .catch((error) => {
    console.log(error);
  });
