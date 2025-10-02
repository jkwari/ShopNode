const mongodb = require("mongodb");
// This _ means that this variable will be only used only in this file;
let _db;

const MongoClient = mongodb.MongoClient;
const mongoConnect = (callback) => {
  MongoClient.connect(
    "mongodb+srv://JKW:z4dFjSmIzzwK6RVD@cluster0.jzrmoxo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
    .then((client) => {
      console.log("Connected!!!");
      // Here we are telling Mongo what is the name of the Database that it needs to
      // create once we supply it with data.
      _db = client.db("Shop");
      callback();
    })
    .catch((error) => {
      console.log(error);

      console.log("Not Connected");
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  return "NO Database";
};
// We are exporting a function here because mongoConnect is a function
exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
