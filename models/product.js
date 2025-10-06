const mongoDB = require("mongodb");
const { get } = require("../routes/admin");
const getDb = require("../util/db").getDb;

class Product {
  constructor(title, price, imageUrl, description, _id, userId) {
    this.title = title;
    this.price = price;
    this.imageUrl = imageUrl;
    this.description = description;
    this._id = _id ? new mongoDB.ObjectId(_id) : null;
    this.userId = userId;
  }

  // in order to save the data to Database we need to use the save()

  save() {
    // Here we are connecting to the db we initialize in util/ db file;
    const db = getDb();
    // Here we are saying what is the collection name(Like:Table);

    // The insertOne method is a way in MongoDB where we can insert data to our
    // collection which it is named as "products";
    // There two ways to insert data to Database:
    // 1. Using insertOne({}): Which takes an Object but in our case we want to pass
    // what we passed in our constructor that's why we passed this.
    // 2. Using insertMany([]) takes an array of objects where you can insert
    // many products at once

    // Those two methods returns a promise so we need to then().catch();
    if (this._id) {
      // For Updating Products when we click edit;
      return db
        .collection("products")
        .updateOne({ _id: this._id }, { $set: this })
        .then((result) => {
          console.log(result);
          console.log("Updated Successfully!!!");
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      // For Inserting a new product where MongoDB will create an ID
      return db
        .collection("products")
        .insertOne(this)
        .then((result) => {
          console.log(result);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  static fetchAll() {
    const db = getDb();
    return db
      .collection("products")
      .find()
      .toArray()
      .then((result) => {
        console.log(result);
        return result;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  static findById(prodId) {
    const db = getDb();
    return db
      .collection("products")
      .find({ _id: new mongoDB.ObjectId(prodId) })
      .next()
      .then((result) => {
        console.log(result);
        return result;
      })
      .catch((error) => {
        console.log(error);
      });
  }
  static deleteProduct(prodId) {
    const db = getDb();

    return db
      .collection("products")
      .deleteOne({ _id: new mongoDB.ObjectId(prodId) })
      .then((result) => {
        return result;
      })
      .catch((error) => {
        console.log(error);
      });
  }
}

module.exports = Product;
