const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const sequelize = require("./util/db");

// Import our Models here:
const Product = require("./models/product");
const User = require("./models/user");
const Cart = require("./models/Cart");
const CartItem = require("./models/cart-Item");

const errorController = require("./controllers/error");

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
  User.findByPk(1)
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

app.use(errorController.get404);

//  Sync Method Helps by creating our table in our database where it has
// a feature to look our models file and create whatever tables we have
// their but if and only if it is  not created before so it doesn't
// override our table

// Here we will declare our relations before synchronizing it to database:
// onDelete property insures if the User has been deleted any  products done
// by the user will be deleted as well;
Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
// Since Many to Many relations require third table to store productID key
// and CartID key so here comes the through property it tells mysql where
// to store those keys in otherwords our third table is "CartItem";
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

sequelize
  // Now sync's job is to create those models and add them to DB but if we want
  // to alter the database we can use propert called "force" where it will
  // force the changes we added to the database by dropping the old tables
  // and replace them with the new ones including the relations(Associations).
  // .sync({ force: true })
  .sync()
  .then((result) => {
    // console.log(result);
    return User.findByPk(1);
  })
  .then((user) => {
    if (!user) {
      return User.create({ name: "Khaled", email: "k@test.com" });
    }
    return user;
  })
  .then((result) => {
    return result.createCart();
  })
  .then((cart) => {
    app.listen(3000);
  })
  .catch((error) => {
    console.log(error);
  });
