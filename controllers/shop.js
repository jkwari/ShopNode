const Product = require("../models/product");
const Order = require("../models/user");
exports.getProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.getProductDetails = (req, res, next) => {
  const prodID = req.params.productID;
  // This method finds a product by its Primary Key it is similar to findById
  Product.findById(prodID)
    .then((row) => {
      res.render("shop/product-detail", {
        pageTitle: "Details",
        path: "/productDetail/:productID",
        product: row,
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((error) => {
      console.log(error);
    });

  // res.redirect("/");
};

exports.getIndex = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.getCart = (req, res, next) => {
  req.user.populate("cart.items.productId").then((user) => {
    const products = user.cart.items;
    // console.log(user.cart.items);

    res.render("shop/cart", {
      path: "/cart",
      pageTitle: "Your Cart",
      products: products,
      isAuthenticated: req.session.isLoggedIn,
    });
  });
};

exports.postCart = (req, res, next) => {
  const prodID = req.body.productID;
  Product.findById(prodID)
    .then((product) => {
      // console.log(product);

      return req.user.addToCart(product);
    })
    .then((result) => {
      console.log(result);
      res.redirect("/cart");
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.removeItemFromCart = (req, res, next) => {
  const id = req.body.productId;
  req.user
    .deleteItemFromCart(id)
    .then((result) => {
      res.redirect("/cart");
    })

    .catch((error) => {
      console.log(error);
    });
};

exports.postOrders = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then((result) => {
      const products = result.cart.items.map((i) => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
      const order = new Order({
        user: {
          username: req.user.username,
          email: req.user.email,
          userId: req.user,
        },
        products: products,
      });
      req.user.cart.items = [];
      return order.save().then((result) => {
        console.log("This is what it saves: " + result);
      });
    })
    .then(() => {
      res.redirect("/orders");
    })
    .catch((error) => {
      console.log(error);
    });
};
exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    path: "/orders",
    pageTitle: "Your Orders",
    isAuthenticated: req.session.isLoggedIn,
  });
};

// exports.getCheckout = (req, res, next) => {
//   res.render("shop/checkout", {
//     path: "/checkout",
//     pageTitle: "Checkout",
//   });
// };
