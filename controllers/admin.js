const Product = require("../models/product");
const User = require("../models/user");

// exports.getRegister = (req, res, next) => {
//   res.render("admin/users", {
//     pageTitle: "Register Page",
//     path: "/admin/register",
//   });
// };
// exports.postRegister = (req, res, next) => {
//   const nameForm = req.body.name;
//   const emailForm = req.body.email;

//   User.create({
//     name: nameForm,
//     email: emailForm,
//   })
//     .then((result) => {
//       console.log(`Welcome, ${nameForm} is our Admin` + result);
//       res.redirect("/admin/products");
//     })
//     .catch((error) => {
//       console.log(error);
//     });
// };
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
  const product = new Product(
    title,
    price,
    imageUrl,
    description,
    null,
    req.user._id
  );
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
  Product.findById(id)
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
  const product = new Product(
    updatedTitle,
    updatedprice,
    updatedImageUrl,
    updatedDes,
    id
  );
  product
    .save()
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
  Product.deleteProduct(id)
    .then((result) => {
      console.log("The Product Deleted Successfully!!!!!!!");
      res.redirect("/admin/products");
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
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
