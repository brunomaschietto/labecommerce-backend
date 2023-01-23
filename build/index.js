"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const database_1 = require("./database");
const knex_1 = require("./database/knex");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.listen(3003, () => {
    console.log("Servidor rodando na porta 3003");
});
app.get("/ping", (req, res) => {
    res.send("Pong!");
});
app.get("/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield knex_1.db.raw(`
    SELECT * FROM users;
    `);
        res.status(200).send({ Users: result });
    }
    catch (error) {
        console.log(error);
        if (res.statusCode === 200) {
            res.status(500);
        }
        res.send(error.message);
    }
}));
app.get("/products", (req, res) => {
    try {
        res.status(200).send(database_1.products);
    }
    catch (error) {
        console.log(error);
        if (res.statusCode === 200) {
            res.status(500);
        }
        res.send(error.message);
    }
});
app.get("/purchases", (req, res) => {
    res.status(200).send(database_1.purchases);
});
app.get("/products/search", (req, res) => {
    try {
        const q = req.query.q;
        const productsFilter = database_1.products.filter((product) => product.name.toLowerCase().includes(q.toLowerCase()));
        if (q.length < 1) {
            res.status(404);
            throw new Error("O nome do produto deve possuir mais do que um caractere");
        }
        res.status(200).send(productsFilter);
    }
    catch (error) {
        console.log(error);
        if (res.statusCode === 200) {
            res.status(500);
        }
        res.send(error.message);
    }
});
app.post("/users", (req, res) => {
    try {
        const id = req.body.id;
        const email = req.body.email;
        database_1.users.map((user) => {
            if (user.id === id) {
                res.status(404);
                throw new Error("O Id da conta já está sendo utilizado por outra pessoa");
            }
            else if (user.email === email) {
                res.status(404);
                throw new Error("O email da conta já está sendo utilizado por outra pessoa");
            }
        });
        const password = req.body.password;
        const newUser = {
            id,
            email,
            password,
        };
        database_1.users.push(newUser);
        res.status(201).send("Cadastro realizado com sucesso!");
    }
    catch (error) {
        console.log(error);
        if (res.statusCode === 200) {
            res.status(500);
        }
        res.send(error.message);
    }
});
app.post("/products", (req, res) => {
    const id = req.body.id;
    database_1.products.map((product) => {
        if (product.id === id) {
            res.status(404);
            throw new Error("O Id do produto já está sendo utilizado por outro produto");
        }
    });
    const name = req.body.name;
    const price = req.body.price;
    const category = req.body.category;
    const newProduct = {
        id,
        name,
        price,
        category,
    };
    database_1.products.push(newProduct);
    res.status(201).send("Cadastro realizado com sucesso!");
});
app.post("/purchases", (req, res) => {
    const userId = req.body.userId;
    const findUser = database_1.users.find((user) => user.id === userId);
    if (!findUser) {
        res.status(404);
        throw new Error("O Id do usuário não existe");
    }
    const productId = req.body.productId;
    const findProduct = database_1.products.find((product) => product.id === productId);
    if (!findProduct) {
        res.status(404);
        throw new Error("O produto não está cadastrado");
    }
    const quantity = req.body.quantity;
    const totalPrice = req.body.totalPrice;
    const newPurchase = {
        userId,
        productId,
        quantity,
        totalPrice,
    };
    database_1.purchases.push(newPurchase);
    res.status(201).send("Cadastro realizado com sucesso!");
});
app.get("/products/:id", (req, res) => {
    const id = req.params.id;
    const result = database_1.products.find((product) => id === product.id);
    res.status(200).send(result);
});
app.delete("/users/:id", (req, res) => {
    const id = req.params.id;
    const indexToRemove = database_1.users.findIndex((user) => id === user.id);
    if (indexToRemove >= 0) {
        database_1.users.splice(indexToRemove, 1);
    }
    res.status(200).send("User apagado com sucesso");
});
app.delete("/products/:id", (req, res) => {
    const id = req.params.id;
    const indexToRemove = database_1.products.findIndex((product) => id === product.id);
    if (indexToRemove >= 0) {
        database_1.users.splice(indexToRemove, 1);
    }
    res.status(200).send("Produto apagado com sucesso");
});
app.put("/users/:id", (req, res) => {
    const id = req.params.id;
    const newId = req.body.id;
    const newEmail = req.body.email;
    const newPassword = req.body.password;
    const userEdit = database_1.users.find((user) => id === user.id);
    if (userEdit) {
        userEdit.id = newId || userEdit.id;
        userEdit.email = newEmail || userEdit.email;
        userEdit.password = newPassword || userEdit.password;
    }
    res.status(200).send("User atualizado com sucesso");
});
app.put("/products/:id", (req, res) => {
    const id = req.params.id;
    const newId = req.body.id;
    const newName = req.body.name;
    const newPrice = req.body.price;
    const newCategory = req.body.password;
    const userEdit = database_1.products.find((product) => id === product.id);
    if (userEdit) {
        userEdit.id = newId || userEdit.id;
        userEdit.name = newName || userEdit.name;
        userEdit.price = newPrice || userEdit.price;
        userEdit.category = newCategory || userEdit.category;
    }
    res.status(200).send("Produto atualizado com sucesso");
});
//# sourceMappingURL=index.js.map