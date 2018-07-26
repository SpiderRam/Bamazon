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
    
    connection.query("SELECT prodDept.department_id, prodDept.department_name, prodDept.over_head_costs, SUM(prodDept.product_sales)as product_sales, (SUM (prodDept.product_sales) - prodDept.over_head_costs) as total_profit FROM (SELECT departments.department_id, departments.department_name, departments.over_head_costs, IFNULL(products.product_sales,0) as product_sales FROM products RIGHT JOIN departments ON products.department_name = departments.department_name) as prodDept GROUP BY department_id", function(err, res) {
        console.log("\n\n------------------------\n\n");
        console.table(res);
        console.log("\n\n------------------------\n\n");
    });
    chooseAction();
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
            "INSERT INTO departments SET ?",
            {
                department_name: answers.departmentName,
                over_head_costs: answers.cost
            },
            function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("New Department added!");
                    chooseAction();
                };
            }
        );
    });
};