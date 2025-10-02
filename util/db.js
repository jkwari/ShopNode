const mongodb = require("mongodb");

const MongoClient = mongodb.MongoClient;
const mongoConnect = (callback) => {
  MongoClient.connect(
    "mongodb+srv://JKW:z4dFjSmIzzwK6RVD@cluster0.jzrmoxo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
    .then((client) => {
      console.log("Connected!!!");
      callback(client);
    })
    .catch((error) => {
      console.log(error);

      console.log("Not Connected");
    });
};
// We are exporting a function here because mongoConnect is a function
module.exports = mongoConnect;
