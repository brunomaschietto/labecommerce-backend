export type TUser = {
    id: string
    email: string
    password: string
}

export type TProduct = {
    id: string
    name: string
    price: number
    category: PRODUCTS_CATEGORY
}

export type TPurchase = {
    userId: string
    productId: string
    quantity: number
    totalPrice: number
}

export enum PRODUCTS_CATEGORY {
    DOCE = "Doces",
    ELETRONICOS = "Eletronicos"
}