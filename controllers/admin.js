const { mongo } = require("mongoose");
const mongodb = require("mongodb");
const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product({
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl,
    userId: req.user,
  });
  product
    .save()
    .then((result) => {
      // console.log(result);
      console.log("Data Inserted Successfully!!!!");
      res.redirect("/admin/products");
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  const id = req.params.productID;
  Product.find({ _id: new mongodb.ObjectId(id) })
    .then((product) => {
      console.log(product);

      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        product: product[0],
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.updateProduct = (req, res, next) => {
  const id = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedImageUrl = req.body.imageUrl;
  const updatedprice = req.body.price;
  const updatedDes = req.body.description;
  Product.findById(id)
    .then((product) => {
      product.title = updatedTitle;
      product.price = updatedprice;
      product.imageUrl = updatedImageUrl;
      product.description = updatedDes;
      return product.save();
    })
    .then((result) => {
      console.log("Product Updated Correctly!!!!!!");
      res.redirect("/admin/products");
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.deleteProductByID = (req, res, next) => {
  const id = req.body.productId;
  Product.findByIdAndDelete(id)
    .then((result) => {
      console.log("The Product Deleted Successfully!!!!!!!");
      res.redirect("/admin/products");
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.getProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
      });
    })
    .catch((error) => {
      console.log(error);
    });
};
