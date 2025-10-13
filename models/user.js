const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
  },
});

userSchema.methods.addToCart = function (product) {
  if (!this.cart || !this.cart.items) {
    this.cart = { items: [] };
  }
  const cartProductIndex = this.cart.items.findIndex((cp) => {
    // Making sure that they are Strings when we do the comparison
    return cp.productId.toString() === product._id.toString();
  });
  let newQuantity = 1;
  const updatedCartItems = [...this.cart.items];
  if (cartProductIndex >= 0) {
    // Product exist in cart just update its quantity
    newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    updatedCartItems[cartProductIndex].quantity = newQuantity;
  } else {
    // does not exist then push it to the updatedCartItems array
    updatedCartItems.push({
      productId: product._id,
      quantity: newQuantity,
    });
  }

  const updateCart = {
    items: updatedCartItems,
  };
  this.cart = updateCart;
  return this.save();
};

module.exports = mongoose.model("User", userSchema);

// const mongoDb = require("mongodb");
// const { get } = require("../routes/admin");
// const getDb = require("../util/db").getDb;
// class User {
//   constructor(username, email, cart, id) {
//     this.username = username;
//     this.email = email;
//     this.cart = cart ? cart : { items: [] };
//     this.id = id;
//   }

//   save() {
//     const db = getDb();
//     return db
//       .collection("users")
//       .insertOne(this)
//       .then((result) => {
//         console.log(result);
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   }

//   addToCart(product) {
//     if (!this.cart || !this.cart.items) {
//       this.cart = { items: [] };
//     }
//     const cartProductIndex = this.cart.items.findIndex((cp) => {
//       // Making sure that they are Strings when we do the comparison
//       return cp.productID.toString() === product._id.toString();
//     });
//     let newQuantity = 1;
//     const updatedCartItems = [...this.cart.items];
//     if (cartProductIndex >= 0) {
//       // Product exist in cart just update its quantity
//       newQuantity = this.cart.items[cartProductIndex].quantity + 1;
//       updatedCartItems[cartProductIndex].quantity = newQuantity;
//     } else {
//       // does not exist then push it to the updatedCartItems array
//       updatedCartItems.push({
//         productID: new mongoDb.ObjectId(product._id),
//         quantity: newQuantity,
//       });
//     }

//     const updateCart = {
//       items: updatedCartItems,
//     };
//     const db = getDb();
//     return db
//       .collection("users")
//       .updateOne(
//         { _id: new mongoDb.ObjectId(this.id) },
//         { $set: { cart: updateCart } }
//       );
//   }

//   getCart() {
//     const db = getDb();
//     if (!this.cart || !this.cart.items || this.cart.items.length === 0) {
//       return Promise.resolve([]);
//     }
//     const prodsID = this.cart.items.map((i) => {
//       return i.productID;
//     });

//     return db
//       .collection("products")
//       .find({ _id: { $in: prodsID } })
//       .toArray()
//       .then((products) => {
//         // console.log("This is from USER MODEL " + products);// [Object object]

//         return products.map((p) => {
//           // console.log("This is comming from User Model " + p);

//           return {
//             ...p,
//             quantity: this.cart.items.find((i) => {
//               return i.productID.toString() === p._id.toString();
//             }).quantity,
//           };
//         });
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   }
//   deleteItemFromCart(prodID) {
//     const updatedCart = this.cart.items.filter((i) => {
//       return i.productID.toString() !== prodID.toString();
//     });
//     const db = getDb();
//     return db.collection("users").updateOne(
//       {
//         _id: new mongoDb.ObjectId(this.id),
//       },
//       { $set: { cart: { items: updatedCart } } }
//     );
//   }

//   addOrder() {
//     const db = getDb();

//     return this.getCart()
//       .then((products) => {
//         if (!products || products.length === 0) {
//           console.log("No items in cart — nothing to order.");
//           return;
//         }

//         const order = {
//           items: products,
//           user: {
//             _id: new mongoDb.ObjectId(this.id),
//             username: this.username,
//             email: this.email,
//           },
//           createdAt: new Date(),
//         };

//         // Step 1: Insert order document
//         return db.collection("orders").insertOne(order);
//       })
//       .then(() => {
//         // Step 2: Clear the cart locally + in DB
//         this.cart = { items: [] };

//         return db
//           .collection("users")
//           .updateOne(
//             { _id: new mongoDb.ObjectId(this.id) },
//             { $set: { cart: { items: [] } } }
//           );
//       })
//       .catch((err) => {
//         console.log("Error while adding order:", err);
//       });
//   }

//   static findById(userId) {
//     const db = getDb();
//     return db
//       .collection("users")
//       .find({ _id: new mongoDb.ObjectId(userId) })
//       .next()
//       .then((result) => {
//         console.log(result);
//         return result;
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   }
// }

// module.exports = User;
