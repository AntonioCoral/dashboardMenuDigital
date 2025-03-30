import CarouselImage from './../models/carouselImage.model';
import { Request, Response } from 'express';



// Obtener imágenes por sección y compañía
export const getImagesBySection = async (req: Request, res: Response) => {
  try {
    const companyId = req.companyId; // 🔹 Obtener la empresa desde el token

    if (!companyId) {
      return res.status(403).json({ message: 'Acceso no autorizado' });
    }

    const { section } = req.params;

    if (!['carousel', 'home'].includes(section)) {
      return res.status(400).json({ message: 'Sección inválida' });
    }

    const images = await CarouselImage.findAll({
      where: { section, companyId },
    });

    // 🔹 Modificamos la URL de la imagen para que pueda ser accedida
    const modifiedImages = images.map(image => ({
      ...image.toJSON(),
      imageUrl: `${req.protocol}://${req.get('host')}/api/carousel/uploads/${image.imageUrl}`
    }));

    res.status(200).json(modifiedImages);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener imágenes', error });
  }
};




// Agregar una imagen con compañía
export const addImage = async (req: Request, res: Response) => {
  try {
    const companyId = req.companyId;

    if (!companyId) {
      return res.status(403).json({ message: 'Acceso no autorizado' });
    }

    const { title, description, section } = req.body;
    const imageUrl = req.file ? req.file.filename : '';

    const newImage = await CarouselImage.create({
      companyId,
      title,
      description,
      imageUrl,
      section,
      isActive: false
    });

    res.status(201).json({ message: 'Imagen agregada correctamente', newImage });
  } catch (error) {
    res.status(500).json({ message: 'Error al agregar la imagen', error });
  }
};

// Actualizar una imagen del carrusel
export const updateImage = async (req: Request, res: Response) => {
  try {
    const companyId = req.companyId;

    if (!companyId) {
      return res.status(403).json({ message: 'Acceso no autorizado' });
    }

    const { id } = req.params;
    const { title, description, imageUrl, isActive } = req.body;

    const image = await CarouselImage.findOne({ where: { id, companyId } });

    if (!image) {
      return res.status(404).json({ message: 'Imagen no encontrada o no pertenece a la empresa' });
    }

    await image.update({ title, description, imageUrl, isActive });

    res.status(200).json({ message: 'Imagen actualizada correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la imagen', error });
  }
};


// Eliminar una imagen del carrusel
export const deleteImage = async (req: Request, res: Response) => {
  try {
    const companyId = req.companyId;

    if (!companyId) {
      return res.status(403).json({ message: 'Acceso no autorizado' });
    }

    const { id } = req.params;
    const image = await CarouselImage.findOne({ where: { id, companyId } });

    if (!image) {
      return res.status(404).json({ message: 'Imagen no encontrada o no pertenece a la empresa' });
    }

    await image.destroy();
    res.status(200).json({ message: 'Imagen eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la imagen', error });
  }
};

export const addImageWithSection = async (req: Request, res: Response): Promise<void> => {
  try {
    const companyId = req.companyId;

    if (!companyId) {
      res.status(403).json({ message: 'Acceso no autorizado' });
      return;
    }

    const { title, description, section } = req.body;
    const imageUrl = req.file ? req.file.filename : '';

    const newImage = await CarouselImage.create({
      companyId,
      title,
      description,
      imageUrl,
      section,
      isActive: false
    });

    res.status(201).json({ message: 'Imagen agregada correctamente', newImage });
  } catch (error) {
    res.status(500).json({ message: 'Error al agregar la imagen', error });
  }
};

export const uploadCarouselImage = async (req: Request, res: Response): Promise<void> => {
  if (!req.file) {
    res.status(400).json({ message: 'No se proporcionó ninguna imagen.' });
    return;
  }

  try {
    const companyId = req.companyId;

    if (!companyId) {
      res.status(403).json({ message: 'Acceso no autorizado' });
      return;
    }

    // Ruta relativa de la imagen (URL para acceder desde el cliente)
    const imageUrl = req.file ? req.file.filename : '';

    // Opcional: Guarda la URL en la base de datos asociada a la empresa
    const newImage = await CarouselImage.create({
      companyId,
      title: req.body.title || 'Sin título', // Campo opcional para un título
      description: req.body.description || 'Sin descripción', // Campo opcional para una descripción
      imageUrl,
      section: 'carousel',
      isActive: false
    });

    res.status(200).json({
      message: 'Imagen subida con éxito.',
      data: newImage, // Retorna la imagen subida con los detalles
    });
  } catch (error) {
    console.error('Error al guardar la imagen en la base de datos:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};
