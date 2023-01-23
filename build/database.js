"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.purchases = exports.products = exports.users = void 0;
const types_1 = require("./types");
exports.users = [
    { id: "Bruno", email: "bruno4_10@hotmail.com", password: "anabanana" },
    {
        id: "Maria Constance",
        email: "mariaConstance@email.com",
        password: "maria123",
    },
];
exports.products = [
    {
        id: '01',
        name: 'Chocolate',
        price: 5,
        category: types_1.PRODUCTS_CATEGORY.DOCE
    },
    {
        id: '02',
        name: 'Celular',
        price: 3000,
        category: types_1.PRODUCTS_CATEGORY.ELETRONICOS
    }
];
exports.purchases = [
    {
        userId: 'Bruno',
        productId: '01',
        quantity: 2,
        totalPrice: 10
    },
    {
        userId: 'Maria Constance',
        productId: '02',
        quantity: 1,
        totalPrice: 3000
    }
];
//# sourceMappingURL=database.js.map