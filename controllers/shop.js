const Product = require("../models/product");
const Cart = require("../models/Cart");

exports.getProducts = (req, res, next) => {
  Product.findAll()
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
  Product.findByPk(prodID)
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
  Product.findAll()
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
  req.user
    .getCart()
    .then((result) => {
      result
        .getProducts()
        .then((products) => {
          res.render("shop/cart", {
            path: "/cart",
            pageTitle: "Your Cart",
            products: products,
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

exports.postCart = (req, res, next) => {};

exports.removeItemFromCart = (req, res, next) => {
  const id = req.body.productId;
  Product.fetchProductById(id, (products) => {
    Cart.deleteProduct(id, products.price);
    res.redirect("/cart");
  });
};

exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    path: "/orders",
    pageTitle: "Your Orders",
  });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};
