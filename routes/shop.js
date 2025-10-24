const path = require("path");

const express = require("express");

const shopController = require("../controllers/shop");
const isAuth = require("../middleware/isAuth");

const router = express.Router();

router.get("/", shopController.getIndex);

router.get("/products", shopController.getProducts);

router.get("/products/:productID", shopController.getProductDetails);

router.get("/cart", isAuth, shopController.getCart);

router.post("/cart", isAuth, shopController.postCart);

router.post("/remove-item-cart", isAuth, shopController.removeItemFromCart);

router.get("/orders", isAuth, shopController.getOrders);
router.post("/orders", isAuth, shopController.postOrders);

// router.get("/checkout", shopController.getCheckout);

// router.get("/productDetail/:productID", shopController.getProductDetails);

module.exports = router;
