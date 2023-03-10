-- Active: 1673973549397@@127.0.0.1@3306

-- Introdução SQL
CREATE TABLE users (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    createdAt TEXT DEFAULT (DATETIME('now', 'localtime')) NOT NULL
);

INSERT INTO users (
    id,
    email,
    password,
    createdAt 
)
VALUES 
("user1", "bruno4_10@hotmail.com", "brunoM1234", DATETIME()), 
("user2", "mariaconstance@email.com", "mariaC1234", DATETIME()),
("user3", "anaLucia@email.com", "analucia1234", DATETIME()),
("user4", "paulo@email.com", "pauloC1234", DATETIME());

SELECT * FROM users;

DROP TABLE users;

CREATE TABLE products (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    name TEXT UNIQUE NOT NULL,
    price REAL NOT NULL,
    description TEXT NOT NULL,
    imageUrl TEXT NOT NULL
);

INSERT INTO products (
    id,
    name,
    price,
    description,
    imageUrl
)
VALUES
("product1", "Chocolate", 4.99, "Chocolate ao leite", "imagem chocolate"),
("product2", "Sorvete", 10.99, "Sorvete de baunilha", "imagem sorvete de baunilha"),
("product3", "Brinco", 100, "Brinco de prata 925, modelo argola", "imagem brinco"),
("product4", "Corrente", 200, "Corrente de prata 925, 40cm", "imagem corrente"),
("product5", "Celular", 4000, "Iphone 12, 128gb", "imagem iphone 12");

DROP TABLE products;

SELECT * FROM products;

-- Aprofundamento SQL

-- Exercicio 1

SELECT * FROM users;
SELECT * FROM products;

SELECT * FROM products
WHERE name LIKE "Chocolate";

INSERT INTO users (
    id,
    email,
    password
)
VALUES 
("user5", "cleiton24@email.com", "cleitinho1234"); 

INSERT INTO products (
    id,
    name,
    price,
    category
)
VALUES
("product6", "Trident", 2.99, "Doces");

-- Exercicio 2

SELECT * FROM products
WHERE id LIKE "product1";

DELETE FROM users
WHERE id = "user5";

DELETE FROM products
WHERE id = "product6";

UPDATE users
SET password = "BRUNOM12345"
WHERE id = "user1";

UPDATE products
SET price = 5.99
WHERE id = "product1";

-- Exercicio 3

SELECT * FROM users
ORDER BY email ASC;

SELECT * FROM products
ORDER BY price ASC
LIMIT 20
OFFSET 1;

SELECT * FROM products
WHERE price BETWEEN 20 AND 200;

-- Relações SQL 

-- Exercicio 1

CREATE TABLE purchases (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    buyer_id TEXT NOT NULL,
    totalPrice INTEGER NOT NULL,
    createdAt TEXT DEFAULT (DATETIME('now', 'localtime')) NOT NULL,
    paid INTEGER NOT NULL,
    FOREIGN KEY (buyer_id) REFERENCES users(id)
);

-- Exercicio 2

INSERT INTO purchases (id, buyer_id, totalPrice, createdAt, paid)
VALUES ("purchase1", "user1", 4000, DATETIME(), 0),
       ("purchase2", "user2", 12, DATETIME(), 1),
       ("purchase3", "user4", 110.99, DATETIME(), 0),
       ("purchase4", "user3", 11.98, DATETIME(), 1);

SELECT * FROM purchases;

DROP TABLE purchases;

UPDATE purchases
SET delivered_at = DATETIME()
WHERE id = "purchase1";

SELECT * FROM users
INNER JOIN purchases
ON purchases.buyer_id = users.id;

-- Relações SQL II

-- Exercicio 1

CREATE TABLE purchases_products(
    purchase_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    FOREIGN KEY (purchase_id) REFERENCES purchases(id)
    FOREIGN KEY (product_id) REFERENCES products(id)
);

DROP TABLE purchases_products;

INSERT INTO purchases_products(purchase_id, product_id, quantity)
VALUES
("purchase1", "product1", 3),
("purchase1", "product2", 2),
("purchase2", "product1", 5);
SELECT * FROM purchases_products;

SELECT * FROM purchases
LEFT JOIN purchases_products
ON purchases_products.purchase_id = purchases.id
INNER JOIN products
ON purchases_products.product_id = products.id;

-- SearchProductById

SELECT 
    purchases.id AS purchaseId,
    purchases.total_price AS totalPrice,
    purchases.paid,
    purchases.delivered_at AS deliveredAt,
    purchases.buyer_id AS buyerId,
    products.id AS productId,
    products.name AS productName,
    products.price,
    products.category
FROM
    purchases_products
    JOIN purchases ON purchases_products.purchase_id = purchases.id
    INNER JOIN products ON purchases_products.product_id = products.id;

