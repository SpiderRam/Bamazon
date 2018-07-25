var mysql = require("mysql");
var inquirer = require('inquirer');
require('console.table');

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
    connection.query("SELECT * FROM departments", function(err, results) {
        if (err) {
            throw err;
        };
             
        inquirer
            .prompt([
                {
                    type:"list",
                    name:"options",
                    message:"What would you like to do?",
                    choices:["View Product Sales by Department", "Create New Department"]
                }  
            ])
            .then(function(answer) {
                if (answer.options === "View Product Sales by Department") {
                    viewProductSales();
                } else if (answer.options === "Create New Department") {
                    createNewDepartment();
                };
            });
    });
};

function viewProductSales() {
    console.log("learn aliases, end as, and joins");

    connection.query("CREATE TEMPORARY TABLE supervisor_table SELECT * FROM departments", function(err, res) {
        if (err) {
            throw err;
        } else {
            connection.query("SELECT * FROM supervisor_table", function(err, res) {
                if (err) {
                    throw err;
                } else {
                    connection.query("SELECT product_sales INTO supervisor_table FROM products"), function(err, res) {
                        if (err) {
                            throw err;
                        } else {
                            console.table(res);
                        }
                    };
                }
            });
        }
    });
};

function createNewDepartment() {
    inquirer.prompt([
        {
            type:"input",
            name:"departmentName",
            message:"What is the name of the department you'd like to create?"
        },
        {
            type:"input",
            name:"cost",
            message:"What is the estimated overhead cost of running this department?"
        }
    ])
    .then(function addNewDepartment(answers) {
        connection.query(
            "INSERT INTO products SET ?",
            {
                department_name: answers.departmentName,
                over_head_costs: answers.cost
            },
            function (err) {
                if (err) {
                    console.log('err');
                } else {
                    console.log("New Department added!");
                    chooseAction();
                };
            }
        );
    });
};