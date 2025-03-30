// src/controllers/productOptionController.ts
import { Request, Response } from 'express';
import ProductOption from '../models/ProductOption';

// Obtener todas las opciones de precios
export const getProductOptions = async (req: Request, res: Response) => {
  try {
    const options = await ProductOption.findAll();
    res.json(options);
  } catch (error) {
    res.status(500).json({ msg: 'Error fetching product options', error });
  }
};

// Crear una nueva opción de precio
export const createProductOption = async (req: Request, res: Response) => {
  const { productId, price, description } = req.body;

  try {
    const newOption = await ProductOption.create({ productId, price, description });
    res.status(201).json(newOption);
  } catch (error) {
    res.status(500).json({ msg: 'Error creating product option', error });
  }
};

// Eliminar una opción de precio
export const deleteProductOption = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const option = await ProductOption.findByPk(id);
    if (!option) {
      return res.status(404).json({ msg: 'Product option not found' });
    }

    await option.destroy();
    res.json({ msg: 'Product option deleted successfully' });
  } catch (error) {
    res.status(500).json({ msg: 'Error deleting product option', error });
  }
};
