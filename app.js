const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongodb = require("mongodb");

const errorController = require("./controllers/error");
const mongo = require("./util/db").mongoConnect;

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

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findById("68e03b741f36bc28bf3bd892")
    .then((user) => {
      // We are storing the entire Object of a user in order to use its methods
      // and attributes
      req.user = new User(user.username, user.email, user.cart, user._id);
      // console.log("comming from app.js " + user);

      next();
    })
    .catch((error) => {
      console.log(error);
    });
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongo(() => {
  app.listen(3000);
});
