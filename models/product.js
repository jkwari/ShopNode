const db = require("../util/db");
const Cart = require("./Cart");

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    // The ? (Placeholders) is an extra security layer to prevent SQL Injections
    return db.execute(
      "INSERT INTO products (title, price, description, imageUrl) VALUES (?,?,?,?)",
      [this.title, this.price, this.description, this.imageUrl]
    );
  }

  static delete(id) {}

  static fetchAll() {
    return db.execute("SELECT * FROM products");
  }

  static fetchProductById(id) {
    return db.execute(`SELECT * FROM products WHERE id = ${id}`);
  }
};
