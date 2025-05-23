import { ProductOptionAttributes } from './../interfaces/interfaces';
import { Request, Response } from 'express';
import Product from '../models/Producto';
import Category from '../models/Categoria';
import { Op, fn, col } from 'sequelize'; // Importar directamente desde 'sequelize'
import sequelize from 'sequelize';
import ProductOption from '../models/ProductOption';
import Company from '../models/company';
import fs from 'fs';
import path from 'path';

export const createProduct = async (req: Request, res: Response) => {
  const { name, cost, price, barcode, categoryId, productId } = req.body;
  const image = req.file ? req.file.filename : '';
  const companyId = req.companyId; // 🔹 Obtener companyId del middleware

  if (!companyId) {
    return res.status(403).json({ message: 'Acceso no autorizado: Compañía no encontrada' });
  }

  try {
    const newProduct = await Product.create({
      name,
      cost,
      price,
      barcode,
      image,
      categoryId,
      productId,
      companyId, // 🔹 Asociar el producto a la empresa
    });

    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el producto', error });
  }
};


// Crear múltiples productos (importación masiva)
export const createProductsBulk = async (req: Request, res: Response) => {
  const products = req.body; // Se espera un array de productos

  try {
    const newProducts = await Product.bulkCreate(products);

    res.status(201).json(newProducts);
  } catch (error) {
    console.error('Error creating products:', error);
    res.status(500).json({ msg: 'Error creating products', error });
  }
};


export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, cost, price, barcode, categoryId } = req.body;
  const companyId = req.companyId; // 🔹 Obtener companyId

  if (!companyId) {
    return res.status(403).json({ message: 'Acceso no autorizado: Compañía no encontrada' });
  }

  let options = req.body.options;
  if (typeof options === 'string') {
    try {
      options = JSON.parse(options);
    } catch (error) {
      return res.status(400).json({ message: 'Error al procesar las opciones' });
    }
  }

  const image = req.file ? req.file.filename : undefined;

  try {
    const product = await Product.findOne({
      where: { id, companyId }, // 🔹 Filtrar por empresa
    });

    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    const updatedProduct = await product.update({
      name,
      cost,
      price,
      barcode,
      image,
      categoryId,
    });

    if (Array.isArray(options)) {
      const existingOptions = await ProductOption.findAll({ where: { productId: id } });

      for (const option of options) {
        const existingOption = existingOptions.find(opt => opt.description === option.description);
        if (existingOption) {
          await existingOption.update({
            description: option.description,
            price: option.price,
          });
        } else {
          await ProductOption.create({
            description: option.description,
            price: option.price,
            productId: Number(id),
          });
        }
      }

      const optionDescriptions = options.map(opt => opt.description);
      const optionsToDelete = existingOptions.filter(opt => !optionDescriptions.includes(opt.description));

      for (const option of optionsToDelete) {
        await option.destroy();
      }
    }

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el producto', error });
  }
};




// Obtener todos los productos
export const getProducts = async (req: Request, res: Response) => {
  try {
    const companyId = req.companyId; // 🔹 Obtenemos el companyId desde el middleware

    if (!companyId) {
      return res.status(403).json({ message: 'Acceso no autorizado: Compañía no encontrada' });
    }

    const products = await Product.findAll({
      where: { companyId }, // 🔹 Filtramos por companyId
      include: [{ model: ProductOption, as: 'options' }],
      order: [['id', 'DESC']],
    });

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los productos', error });
  }
};


// Obtener productos por categoría con paginación
export const getProductsByCategory = async (req: Request, res: Response) => {
  try {
    const companyId = req.companyId;
    const { categoryId } = req.params;

    if (!companyId) {
      return res.status(403).json({ message: 'Acceso no autorizado: Compañía no encontrada' });
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 6;
    const offset = (page - 1) * limit;

    const { count, rows: products } = await Product.findAndCountAll({
      where: { categoryId, companyId },
      include: [{ model: ProductOption, as: 'options' }],
      limit,
      offset,
      order: [['id', 'DESC']],
    });

    res.status(200).json({
      products,
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener productos por categoría', error });
  }
};


export const getProductsBySearch = async (req: Request, res: Response) => {
  const companyId = req.companyId;
  const query = req.query.query;

  if (!companyId) {
    return res.status(403).json({ message: 'Acceso no autorizado: Compañía no encontrada' });
  }

  if (typeof query !== 'string' || !query) {
    return res.status(400).json({ message: 'El parámetro de búsqueda es requerido y debe ser una cadena.' });
  }

  try {
    const products = await Product.findAll({
      where: {
        companyId, // 🔹 Filtrar por empresa
        [Op.or]: [
          sequelize.where(sequelize.fn('LOWER', sequelize.col('name')), {
            [Op.like]: `%${query.toLowerCase()}%`,
          }),
          { barcode: { [Op.like]: `%${query}%` } },
        ],
      },
      include: [{ model: ProductOption, as: 'options' }],
      order: [['id', 'DESC']],
    });

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error al buscar productos', error });
  }
};

// Obtener productos desde el ecommerce móvil usando subdominio
export const getProductsBySearchMenu = async (req: Request, res: Response) => {
  const query = req.query.query as string;
  const subdomain = req.query.subdomain as string;

  if (!subdomain) {
    return res.status(400).json({ message: 'Subdominio requerido' });
  }

  if (!query || typeof query !== 'string') {
    return res.status(400).json({ message: 'El parámetro de búsqueda es requerido y debe ser una cadena.' });
  }

  try {
    // Buscar la empresa por subdominio
    const company = await Company.findOne({ where: { subdomain } });

    if (!company) {
      return res.status(404).json({ message: 'Empresa no encontrada' });
    }

    const products = await Product.findAll({
      where: {
        companyId: company.id,
        [Op.or]: [
          sequelize.where(sequelize.fn('LOWER', sequelize.col('name')), {
            [Op.like]: `%${query.toLowerCase()}%`,
          }),
          { barcode: { [Op.like]: `%${query}%` } },
        ],
      },
      include: [{ model: ProductOption, as: 'options' }],
      order: [['id', 'DESC']],
    });

    res.status(200).json(products);
  } catch (error) {
    console.error('Error al buscar productos por subdominio:', error);
    res.status(500).json({ message: 'Error al buscar productos', error });
  }
};

// Eliminar un producto incluyendo la imagen asegurando que sea de la empresa autenticada

export const deleteProduct = async (req: Request, res: Response) => {
  const productId = req.params.id;
  const companyId = req.companyId;

  try {
    const product = await Product.findOne({
      where: { id: productId, companyId }
    });

    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    // Eliminar la imagen del sistema de archivos
    if (product.image) {
      const imagePath = path.join(__dirname, '../../uploads', product.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
        console.log('Imagen eliminada:', imagePath);
      } else {
        console.log('La imagen no existe en el servidor:', imagePath);
      }
    }

    await product.destroy();
    res.status(200).json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ message: 'Error al eliminar el producto', error });
  }
};
