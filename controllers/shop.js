const Product = require("../models/product");

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
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
      });
    })
    .catch((error) => {
      console.log(error);
    });

  // res.redirect("/");
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.getCart = (req, res, next) => {
  // console.log(
  //   "I want to know what is this method returning " + req.user.getCart()
  // );

  req.user.getCart().then((products) => {
    // console.log("This is comming from the Controller: " + products);

    res.render("shop/cart", {
      path: "/cart",
      pageTitle: "Your Cart",
      products: products,
    });
  });
};

exports.postCart = (req, res, next) => {
  const prodID = req.body.productID;
  Product.findById(prodID)
    .then((product) => {
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
    .addOrder()
    .then((result) => {
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
  });
};

// exports.getCheckout = (req, res, next) => {
//   res.render("shop/checkout", {
//     path: "/checkout",
//     pageTitle: "Checkout",
//   });
// };
