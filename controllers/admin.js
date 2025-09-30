const Product = require("../models/product");
const User = require("../models/user");

exports.getRegister = (req, res, next) => {
  res.render("admin/users", {
    pageTitle: "Register Page",
    path: "/admin/register",
  });
};
exports.postRegister = (req, res, next) => {
  const nameForm = req.body.name;
  const emailForm = req.body.email;

  User.create({
    name: nameForm,
    email: emailForm,
  })
    .then((result) => {
      console.log(`Welcome, ${nameForm} is our Admin` + result);
      res.redirect("/admin/products");
    })
    .catch((error) => {
      console.log(error);
    });
};
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
  Product.create({
    title: title,
    price: price,
    imageUrl: imageUrl,
    description: description,
    userUserId: 1,
  })
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
  Product.findByPk(id)
    .then((product) => {
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        product: product,
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
  Product.findByPk(id)
    .then((product) => {
      product.title = updatedTitle;
      product.imageUrl = updatedImageUrl;
      product.price = updatedprice;
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
  Product.findByPk(id)
    .then((product) => {
      return product.destroy();
    })
    .then((result) => {
      console.log("The Product Deleted Successfully!!!!!!!");
      res.redirect("/admin/products");
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.getProducts = (req, res, next) => {
  Product.findAll()
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
