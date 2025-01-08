import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
const SECRET_KEY = 'prueba1';


export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY!) as any;
    req.companyId = decoded.companyId; // Agrega el companyId al objeto req
    req.user = {
      id: decoded.id,
      username: decoded.username,
      role: decoded.role,
    }; // Agrega datos del usuario al request
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token inválido' });
  }
};

  
  