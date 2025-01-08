import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import Company from '../models/company';

const SECRET_KEY = 'prueba1'; // Usa una clave segura

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({
      where: { username, isActive: true },
      include: [{ model: Company, as: 'company' }], // Incluir la empresa asociada
    });

    if (!user) {
      return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role, companyId: user.companyId },
      SECRET_KEY,
      { expiresIn: '2h' }
    );

    res.json({
      token,
      role: user.role,
      username: user.username,
      isDelivery: user.isDelivery,
      company: user.companyId, // Información de la empresa
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};


export const register = async (req: Request, res: Response) => {

  const { companyId, username, password, role, isDelivery, isActive } = req.body;

  try {
    // Validar los campos
    if (
      typeof companyId !== 'number' ||
      typeof username !== 'string' ||
      typeof password !== 'string' ||
      typeof role !== 'string' ||
      !['admin', 'editor', 'repartidor'].includes(role)
    ) {
      return res.status(400).json({ message: 'Todos los campos obligatorios deben completarse con valores válidos' });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el usuario
    const user = await User.create({
      companyId,
      username,
      password: hashedPassword,
      role: role as 'admin' | 'editor' | 'repartidor', // Confirmar que es uno de los valores permitidos
      isDelivery,
      isActive,
    });

    res.status(201).json({ message: 'Usuario creado exitosamente', user });
  } catch (error) {
    console.error('Error al crear el usuario:', error);
    res.status(500).json({ message: 'Error al crear el usuario' });
  }
};
