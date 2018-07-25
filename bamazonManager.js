var mysql = require("mysql");
var inquirer = require('inquirer');
require('console.table');

var itemInventory;

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
    chooseAction();
});

function chooseAction() { 
    console.log("chooseAction called")          
    inquirer
        .prompt([
            {
                type:"list",
                name:"options",
                message:"What would you like to do?",
                choices:["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
            }
    
        ])
        .then(function(answer) {
            if (answer.choice === "View Products for Sale") {
                viewProducts();
            } else if (answer.choice === "View Low Inventory") {
                viewLowInventory();
            } else if (answer.choice === "Add to Inventory") {
                addInventory();
            } else if (answer.choice === "Add New Product") {
                addProduct();
            };
        });
};


function viewProducts() {
    console.log("viewProducts called");
    connection.query("SELECT * FROM products", function(err, results) {
        if (err) {
            throw err;
        } else {
        console.table(results);
        chooseAction();
        };
    });
};

function viewLowInventory() {
    connection.query("SELECT * FROM products", function(err, results) {
        if (err) {
            throw err;
        }
        for (var i = 0; i < results.length; i++) {
            itemInventory = results[i].stock_quantity;
            if (itemInventory <= 5) {
                console.table(results[i]);
            };
        };
    });
};

function addInventory() {
    connection.query("SELECT * FROM auctions", function(err, res) {
        if (err) {
          throw err;
        } else {
            inquirer.prompt([
                {
                    type:"input",
                    name:"itemId",
                    message:"What product ID do you want to add to?"
                },
                {
                    type:"input",
                    name:"quantity",
                    message:"How many would you like to add?"
                },
            ])
            .then(function updateQuantity(answers) {
                connection.query(
                    "UPDATE products SET ? WHERE ?",
                    [
                        {
                            stock_quantity: answers.quantity
                        },
                        {
                            id: answers.itemId
                        }
                    ],
                    
                    function (err) {
                        
                        if (err) {
                            console.log("oops");
                            
                        } else {
                        console.log("Inventory levels have been updated successfully!");
                        chooseAction();
                        }
                    }   
                    
                )
            });
        }
    });
};

function addProduct() {
    inquirer.prompt([
        {
            type:"input",
            name:"productName",
            message:"What is the name of the product you want to add?"
        },
        {
            type:"input",
            name:"departmentName",
            message:"What is the name of the department in which this item belongs?"
        },
        {
            type:"input",
            name:"price",
            message:"What is the price of this item?"
        },
        {
            type:"input",
            name:"quantity",
            message:"How many of these items are on hand?"
        }
    ])
    .then(function addNewProduct(answers) {
        connection.query(
            "INSERT INTO products SET ?",
            {
                product_name: answers.productName,
                department_name: answers.departmentName,
                price: answers.price,
                stock_quantity: answers.quantity
            },
            function (err) {
                if (err) {
                    console.log('err');
                } else {
                console.log("Your item has been added!");
                chooseAction();
                };
            }
        );
    });
};