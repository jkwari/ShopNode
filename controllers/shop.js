const Product = require("../models/product");
const Cart = require("../models/Cart");

exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("shop/product-list", {
      prods: products,
      pageTitle: "All Products",
      path: "/products",
    });
  });
};

exports.getProductDetails = (req, res, next) => {
  const prodID = req.params.productID;
  Product.fetchProductById(prodID, (product) => {
    res.render("shop/product-detail", {
      pageTitle: "Details",
      path: "/productDetail/:productID",
      product: product,
    });
    console.log(product.title);
  });

  // res.redirect("/");
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("shop/index", {
      prods: products,
      pageTitle: "Shop",
      path: "/",
    });
  });
};

exports.getCart = (req, res, next) => {
  res.render("shop/cart", {
    path: "/cart",
    pageTitle: "Your Cart",
  });
};

exports.postCart = (req, res, next) => {
  const prodID = req.body.productID;
  Product.fetchProductById(prodID, (product) => {
    Cart.addProducts(prodID, product.price);

    res.render("shop/cart", {
      pageTitle: "Cart",
      product: product,
      path: "/cart",
    });
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
