var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");
var colors = require("colors");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
  
    user: "root",

    password: "",
    database: "bamazon"
});


connection.connect(function(err) {
    if (err) throw err;
    console.log("-------------------\nManager View\n-------------------");
    mgrOptions();
});


var mgrOptions = function() {
    inquirer.prompt({
        name: "response",
        type: "list",
        message: "What would you like to do?",
        choices: ["View Products For Sale", "View Low Inventory", "Add To Inventory", "Add New Product"],

    }
    ).then(function(answer) {
        if(answer.response === "View Products For Sale") {
            var query = connection.query('SELECT * FROM products', function(err, result){
                if(err) console.log(err);
        
                var table = new Table({
                    head: ['ID#', 'Product', 'Price', 'Quantity'],
                    colWidths: [5, 15, 8, 10]
                });
        
                    for(var i=0; i<result.length; i++){
                    table.push(
                        [result[i].item_id, result[i].product_name, "$" + result[i].price, result[i].stock_quantity]
                    )
                }
                console.log(table.toString());
                mgrOptions();

        })}

        else if(answer.response === "View Low Inventory") {
            var query = connection.query('SELECT * FROM products where stock_quantity < 5', function(err, result){
                if(err) console.log(err);
                    if(result.length > 0) {
                        var table = new Table({
                        head: ['ID#', 'Product', 'Quantity'],
                        colWidths: [5, 15, 10]
                    });
            
                        for(var i=0; i<result.length; i++){
                        table.push(
                            [result[i].item_id, result[i].product_name, result[i].stock_quantity]
                        )
                        }
                    console.log(table.toString());
                    }
                    else {
                        console.log("***\nNo items with low inventory.\n***")
                    }
                mgrOptions();
        })}

        else if(answer.response === "Add To Inventory") {
            inquirer.prompt([{
                    name: "restock",
                    type: "input",
                    message: "What would you like to restock (ID#)?",
                },
                {
                    name: "quantity",
                    type: "input",
                    message: "How many?",
                }
            ]).then(function(answer) {
                var query = connection.query('SELECT * FROM products where item_id=' + answer.restock, function(err, result){
                    if(err) console.log(err);
                    var currentStock = result[0].stock_quantity;
                    currentStock += parseInt(answer.quantity);
                    var query = connection.query('UPDATE products SET stock_quantity=' + currentStock + ' where item_id=' + answer.restock, function(err, result) {
                        console.log("\nSuccess! Your inventory total is now " + currentStock + ".\n");
                        mgrOptions();
                    })

                })})
            }

        else if(answer.response === "Add New Product") {
            inquirer.prompt([{
                name: "item",
                type: "input",
                message: "What item would you like to add?"
            },
            {   
                name: "department",
                type: "input",
                message: "What department is it in?"
            },
            {   
                name: "price",
                type: "input",
                message: "How much does it cost?"
            },
            {
                name: "quantity",
                type: "input",
                message: "How many would you like to add?"

            }]).then(function(answer) {

            var query = connection.query('INSERT INTO products SET ?',
                {   product_name: answer.item,
                    department_name: answer.department,
                    price: answer.price,
                    stock_quantity: answer.quantity
                }, function(err, res) {
                    if(err) console.log(err);
                    console.log("\nSuccessfully added product!\n")
                    mgrOptions();
                }
            )})
        }
    })
}

                    
                