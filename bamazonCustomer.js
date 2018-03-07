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
    console.log("-------------------\nWelcome to Bamazon!\n-------------------");
    displayInventory();
});

var displayInventory = function() {
    var query = connection.query('SELECT item_id, product_name, price FROM products', function(err, result){
        if(err) console.log(err);

        var table = new Table({
            head: ['ID#', 'Product', 'Price'],
            colWidths: [5, 15, 8]
        });

            for(var i=0; i<result.length; i++){
            table.push(
                [result[i].item_id, result[i].product_name, "$" + result[i].price]
            )
        }
        console.log(table.toString());
        askCustomer();
    });

}

var askCustomer = function() {
    inquirer.prompt([{
        name: "id",
        type: "input",
        message: "What product would you like to buy (ID#)?"
    },
    {
        name: "quantity",
        type: "input",
        message: "How many would you like to purchase?"
    }]
    ).then(function(answer) {
        var query = connection.query('SELECT item_id, price, stock_quantity FROM products', function(err, result){
            var remaining = result[answer.id - 1].stock_quantity - answer.quantity;
            if (remaining >= 0) {
                var query = connection.query('UPDATE products SET stock_quantity=' + remaining + ' where item_id=' + answer.id)
                console.log("Success! Your total is $" + result[answer.id - 1].price * answer.quantity);
            }
            else {
                console.log("INSUFFICIENT QUANTITY! Please check back later.");
            }
            connection.end();
            })
        })
    };