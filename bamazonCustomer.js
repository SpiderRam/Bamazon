var mysql = require("mysql");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Trilogy2018",
  database: "bamazon_db"
});

connection.connect(function(err) {
    if (err) {
      console.log(err.message);
      return;
    }; 
    console.log("connected as id " + connection.threadId);

    connection.query("SELECT * FROM products", function(err, res) {
        if (err) {
          throw err;
        };

        console.log("------------------------------\n");
        console.log('Products: \n');

        for (i = 0; i < res.length; i++) {
            console.log(res[i].id);
            console.log(res[i].product_name);
            console.log(res[i].price);
            console.log("------------------------------\n");
        };
    });
    connection.end();
});