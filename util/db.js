// You can think of Sequelize as a class thats why we need to write in the
// capital letter "S" when we import it.
const Sequelize = require("sequelize");
//  Here we want to establish the connection using Sequelize package
//  We need to create new instance of Sequelize just like we did below also
//  we need to be aware of the parameters we pass it has to at this order
//  to avoid complications ("Database Name", "Username", "mysql Password",{
//  The "dialect" is just telling what database server you want to
//  use here we said mysql.
//  "host" is optional if you want to write here because in default it
//  will use localhost unless you set it otherwise.
// })
const conn = new Sequelize("node-complete", "root", "12345", {
  dialect: "mysql",
  host: "localhost",
});
// Finally we export like we always do so we can use in different
// files in our project.
module.exports = conn;
