import { PRODUCTS_CATEGORY, TProduct, TPurchase, TUser } from "./types";

export const users: TUser[] = [
  { id: "Bruno", email: "bruno4_10@hotmail.com", password: "anabanana" },
  {
    id: "Maria Constance",
    email: "mariaConstance@email.com",
    password: "maria123",
  },
];

export const products: TProduct[] = [
    {
        id: '01',
        name: 'Chocolate',
        price: 5,
        category: PRODUCTS_CATEGORY.DOCE
    },
    {
        id: '02',
        name: 'Celular',
        price: 3000,
        category: PRODUCTS_CATEGORY.ELETRONICOS
    }

]

export const purchases : TPurchase[] = [
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
]
