DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
  item_id INT(10) AUTO_INCREMENT NOT NULL,
  product_name VARCHAR(30) NOT NULL,
  department_name VARCHAR(30) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INT(10) NOT NULL,
  PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Television", "Electronics", 250, 5000), 
      ("Chapstick", "Health", 3.10, 1200),
      ("Headphones", "Electronics", 19.50, 10000), 
      ("Candle", "Home", 2.50, 6000),
      ("Bandaid", "Health", 1.25, 2000),
      ("Candy", "Food", 5, 20000),
      ("Folding Chair", "Home", 35, 500),
      ("Chips", "Food", 1, 10000),
      ("Blanket", "Home", 25, 1000),
      ("Pillow", "Home", 12, 5000)





-- -- show ALL books with authors
-- -- INNER JOIN will only return all matching values from both tables
-- SELECT title, firstName, lastName
-- FROM books
-- INNER JOIN authors ON books.authorId = authors.id;

-- -- show ALL books, even if we don't know the author
-- -- LEFT JOIN returns all of the values from the left table, and the matching ones from the right table
-- SELECT title, firstName, lastName
-- FROM books
-- LEFT JOIN authors ON books.authorId = authors.id;

-- -- show ALL books, even if we don't know the author
-- -- RIGHT JOIN returns all of the values from the right table, and the matching ones from the left table
-- SELECT title, firstName, lastName
-- FROM books
-- RIGHT JOIN authors ON books.authorId = authors.id;