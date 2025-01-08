import { Request, Response, NextFunction } from 'express';
import Company from '../models/company';

export const validateSubdomain = async (req: Request, res: Response, next: NextFunction) => {
  const host = req.headers.host; // Ejemplo: "subdominio1.connectivity.com"
  const subdomain = host?.split('.')[0]; // Extraer el subdominio

  if (!subdomain) {
    return res.status(400).json({ message: 'Subdomain is required' });
  }

  try {
    const company = await Company.findOne({ where: { subdomain } });

    if (!company) {
      return res.status(404).json({ message: 'Invalid subdomain' });
    }

    // Guardar la empresa en `req` para usarla en los controladores
    req.company = company;
    next();
  } catch (error) {
    console.error('Error validating subdomain:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
export const getSubdomain = (req: Request): string => {
    const host = req.headers.host || '';
    // En desarrollo local, usa 'localhost'
    if (host.startsWith('localhost')) {
      return 'localhost';
    }
    return host.split('.')[0]; // Asume que el subdominio está antes del dominio principal
  };
  
  