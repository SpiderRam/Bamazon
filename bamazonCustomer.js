var mysql = require("mysql");
var inquirer = require('inquirer');
var prompt = require('prompt');
require('console.table')

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
    loadProducts()
    
    //buyHowMany();
    
});

function loadProducts(){
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) {
          throw err;
        };

        //JAVASCRIPT WAY / HARD WAY
       /* console.log("------------------------------\n");
        console.log('Products: \n');

        for (i = 0; i < res.length; i++) {
            console.log(res[i].id);
            console.log(res[i].product_name);
            console.log(res[i].price);
            console.log("------------------------------\n");
        };*/
        console.table(res)
        buyWhat(res);
    });
}

function buyWhat(inv) {
   
    inquirer
    .prompt([
        {
            type:"input",
            name:"choice",
            message:"What is the ID of the item you want to buy?"
        },
        {
            type:"input",
            name:"howMany",
            message:"How many would you like??"
        }
    ])
    .then(answers => {
        console.log("ID: ", answers.choice)
        console.log("QTY: ", answers.howMany)       

        /*
        [
            {
                id:1, 
                product_name:"paper",
                department_name:"stock room", 
                price: 30, 
                stock_quantity: 97
            }
        ]
                */
              

        for (var i = 0; i < inv.length; i ++) {          
            
            if (answers.choice == inv[i].id && answers.howMany <= inv[i].stock_quantity) {
                console.log("answers.choice = inv.id", inv[i].id);

            }  
        }
        
    });
};

function checkInventory(id,inventory){

}