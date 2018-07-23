var mysql = require("mysql");
var inquirer = require('inquirer');
require('console.table');

var stockQuantity;
var newStockQuantity;
var customerTotal;
var selectedItem;
var cost;

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
    loadProducts();
});

function loadProducts() {
    connection.query("SELECT * FROM products", function(err,res) {
        if (err) {
            throw err;
        };
        console.table(res);
        chooseItems();
    });
};
    
function chooseItems() {
    console.log("chooseItems called");
    connection.query("SELECT * FROM products", function(err, results) {
        if (err) {
            throw err;
        };
    
        inquirer
        .prompt([
            {
                name: "choice",
                type: "rawlist",
                message: "What is the ID of the item you wish to buy?",
                choices: function createItemArray() {
                    var itemArray = [];
                    for (var i = 0; i < results.length; i++) {
                        itemArray.push(results[i].product_name);
                    }
                    return itemArray;
                }
            },
            {
                type: "input",
                name: "quantity",
                message: "How many of this item would you like to buy?"
            }
        ])
        .then(
            checkStockQuantity(),
        )
    });
};

function checkStockQuantity(answer) {
    
    for (var i = 0; i < results.length; i++) {
        if (results[i].product_name === answer.choice) {
            selectedItem = results[i];
            stockQuantity = selectedItem.stock_quantity;
            requestedQuantity = answer.quantity;
            cost = selectedItem.price;
        };
    };
    if (stockQuantity >= parseInt(requestedQuantity)) {
        changeStockQuantity();
        calculateTotal();
        connection.query (
            "UPDATE products SET ? WHERE ?",
            [
                {
                    stock_quantity: newStockQuantity
                },
                {
                    id: selectedItem.id
                }
            ],
            function(error) {
                if (error) {
                    throw error;
                } else{
                    console.log("Your total is" + customerTotal);
                    loadProducts();
                }
            }
        )
    } else {
        console.log("Insufficient quantity, try again.");
        loadProducts();
    };
};

function changeStockQuantity() {
    newStockQuantity = stockQuantity - requestedQuantity;
};

function calculateTotal() {
    customerTotal = cost * requestedQuantity;
};


