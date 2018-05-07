var mysql = require("mysql");
var inquirer = require("inquirer");
require("console.table");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon"
  });
  
  connection.connect(function(err) {
    if (err) throw err;
    console.log("connection successful!");
    makeTable();
  });
  
  function makeTable() {
    connection.query("SELECT * FROM products", function(err, res) {
      if (err) throw err;
      console.table(res);
      promptSupervisor();
    });
  }
  
  function promptSupervisor() {
    inquirer
      .prompt([
        {
          type: "list",
          name: "choice",
          message: "What would you like to do?",
          choices: ["View Product Sales by Department", "Create New Department", "Quit"]
        }
      ])
      .then(function(val) {
        if (val.choice === "View Product Sales by Department") {
          viewSales();
        }
        else if (val.choice === "Create New Department") {
          addDepartment();
        }
        else {
          console.log("Goodbye!");
          process.exit(0);
        }
      });
  }
  
  function addDepartment() {
    inquirer
      .prompt([
        {
          type: "input",
          name: "name",
          message: "What is the name of the department?"
        },
        {
          type: "input",
          name: "overhead",
          message: "What is the overhead cost of the department?",
          validate: function(val) {
            return val > 0;
          }
        }
      ])
      .then(function(val) {
        connection.query(
          "INSERT INTO departments (department_name, over_head_costs) VALUES (?, ?)",
          [val.name, val.overhead],
          function(err) {
            if (err) throw err;
            console.log("ADDED DEPARTMENT!");
            makeTable();
          }
        );
      });
  }
  
  function viewSales() {
    connection.query(
      "SELECT departProd.department_id, departProd.department_name, departProd.over_head_costs, SUM(departProd.product_sales) as product_sales, (SUM(departProd.product_sales) - departProd.over_head_costs) as total_profit FROM (SELECT departments.department_id, departments.department_name, departments.over_head_costs, IFNULL(products.product_sales, 0) as product_sales FROM products RIGHT JOIN departments ON products.department_name = departments.department_name) as departProd GROUP BY department_id",
      function(err, res) {
        console.table(res);
        promptSupervisor();
      }
    );
  }
  