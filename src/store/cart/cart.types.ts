import { CategoryItem } from "../categories/category.types";

export enum CART_ACTION_TYPES {
    SET_IS_CART_OPEN = 'cart/SET_IS_CART_OPEN',
    SET_CART_ITEMS = 'cart/SET_CART_ITEMS',
};

export type CartItem = CategoryItem & { 
    quantity: number; 
};