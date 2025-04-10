import { Request, Response } from 'express';
import Category from '../models/Categoria';
import Product from '../models/Producto';
import ProductOption from '../models/ProductOption';
import { Company } from '../models';

// Crear una nueva categoría
export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const companyId = req.companyId; // Obtener `companyId` desde el token

    if (!companyId) {
      return res.status(403).json({ message: 'Acceso no autorizado' });
    }

    const category = await Category.create({ name, companyId });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ msg: 'Error creando categoría', error });
  }
};


// Obtener todas las categorías
export const getCategories = async (req: Request, res: Response) => {
  try {
    const companyId = req.companyId;

    if (!companyId) {
      return res.status(403).json({ message: 'Acceso no autorizado' });
    }

    const categories = await Category.findAll({ where: { companyId } });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).send('Error en el servidor');
  }
};


/////////////////////////////////// CONTROLADORES PARA APP MOVIL ////////////////////////////////////////////

//Obtener productos de cada categoria
export const getProductsByCategory = async (req: Request, res: Response) => {
  try {
    const { categoryName } = req.params;

    // Primero encuentra la categoría por nombre para obtener su ID
    const category = await Category.findOne({ where: { name: categoryName } });
    if (!category) {
      res.status(404).json({ message: "Category not found" });
      return;
    }

    // Luego encuentra los productos que pertenecen a esa categoría e incluye las opciones relacionadas
    const products = await Product.findAll({
      where: { categoryId: category.id }, // Usa el ID de la categoría para filtrar productos
      include: [{ model: ProductOption, as: 'options' }] // Incluye las opciones asociadas
    });

    res.json(products);
  } catch (error) {
    console.error('Error fetching products by category:', error);
    res.status(500).json({ msg: 'Error fetching products by category', error });
  }
};

// Obtener productos por categoría con paginación
// Obtener productos por categoría (por nombre o ID)
export const getProductsByCategoryP = async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    let category;
    
    // Verificar si categoryId es un número o una cadena (nombre de categoría)
    if (isNaN(Number(categoryId))) {
      // Si no es un número, buscamos por nombre
      category = await Category.findOne({ where: { name: categoryId } });
    } else {
      // Si es un número, buscamos por ID
      category = await Category.findByPk(categoryId);
    }

    if (!category) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }

    const offset = (Number(page) - 1) * Number(limit);

    // Obtener los productos de la categoría
    const { count: totalItems, rows: products } = await Product.findAndCountAll({
      where: { categoryId: category.id },
      include: [{
        model: ProductOption,
        as: 'options'
      }],
      limit: Number(limit),
      offset: Number(offset),
    });

    const totalPages = Math.ceil(totalItems / Number(limit));

    res.json({
      products,
      totalItems,
      totalPages,
      currentPage: Number(page),
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los productos', error });
  }
};


export const deleteCategory = async (req: Request, res: Response) => {
  const {id} = req.params;
  try{
   const category = await Category.findByPk(id);
   if (!category){
    return res.status(404).json({ msg: 'Categoria no encontrada'});
   }
   await category.destroy();
   res.json({ msg: 'Categoria eliminada con éxito!!'});
  }catch (error){
    res.status(500).json({ msg: 'Categoria no encontrada'})
  }
}

export const getCategoriesMenu = async (req: Request, res: Response) => {
  try {
    const subdomain = req.query.subdomain as string;
    console.log('Subdominio recibido:', subdomain);

    if (!subdomain) {
      return res.status(400).json({ message: 'El subdominio es requerido' });
    }

    const company = await Company.findOne({ where: { subdomain } });

    if (!company) {
      return res.status(404).json({ message: 'Empresa no encontrada' });
    }

    const categories = await Category.findAll({
      where: { companyId: company.id }
    });

    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Error al obtener categorías', error });
  }
};


// 🔹 Obtener productos por categoría usando el subdominio y el nombre de la categoría
export const getProductsByCategoryMenu = async (req: Request, res: Response) => {
  try {
    const { categoryName } = req.params;
    const subdomain = req.query.subdomain as string;

    if (!subdomain) {
      return res.status(400).json({ message: 'Subdominio requerido' });
    }

    const company = await Company.findOne({ where: { subdomain } });
    if (!company) {
      return res.status(404).json({ message: 'Empresa no encontrada' });
    }

    // Buscar categoría por nombre y companyId
    const category = await Category.findOne({
      where: {
        name: categoryName,
        companyId: company.id,
      }
    });

    if (!category) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 6;
    const offset = (page - 1) * limit;

    const { count, rows: products } = await Product.findAndCountAll({
      where: {
        categoryId: category.id,
        companyId: company.id
      },
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
    console.error('Error al obtener productos por categoría:', error);
    res.status(500).json({ message: 'Error al obtener productos por categoría', error });
  }
};
