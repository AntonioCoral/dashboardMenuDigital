// src/models/interfaces.ts
export interface ICategory {
    id?: number;
    name: string;
  }
  

 export interface ProductOptionAttributes {
    id?: number;
    price: number;
    description?: string;
    productId: number;
  }