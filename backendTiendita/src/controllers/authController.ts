import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import Company from '../models/company';
import sequelize from '../db/conecction';

const SECRET_KEY = 'prueba1'; // Usa una clave segura

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({
      where: { username },
      include: [{ model: Company, as: 'company' }],
    });

    if (!user) {
      return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
    }

    const now = new Date();
let blockAccess = false;
let showRenewalNotice = false;

if (!user.lastPaymentDate) {
  // Nunca ha pagado, evaluar por creación
  const createdAt = user.createdAt;
  const diffInDays = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));

  if (diffInDays > 7) {
    blockAccess = true;
  }
} else {
  // Ya ha pagado, evaluar diferencia en días desde el último pago
  const lastPayment = new Date(user.lastPaymentDate);
  const diffInDays = Math.floor((now.getTime() - lastPayment.getTime()) / (1000 * 60 * 60 * 24));

  if (diffInDays > 30) {
    blockAccess = true;
  } else if (diffInDays >= 25) {
    showRenewalNotice = true; // opcional: para mostrar aviso desde 25 días o similar
  }
}

    if (blockAccess) {
      return res.status(403).json({
        message: 'Tu periodo de uso ha expirado. Realiza tu pago para continuar usando la plataforma.',
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
        companyId: user.companyId,
      },
      SECRET_KEY,
      { expiresIn: '2h' }
    );

    res.json({
      token,
      role: user.role,
      username: user.username,
      isDelivery: user.isDelivery,
      company: user.companyId,
      renewalNotice: showRenewalNotice,
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
  } catch (error: any) {
  console.error('Error al crear el usuario:', error);

  if (error.name === 'SequelizeUniqueConstraintError') {
    const field = error.errors?.[0]?.path;

    if (field === 'username') {
      return res.status(400).json({ message: 'El nombre de usuario ya está registrado.' });
    }

    return res.status(400).json({ message: 'Error de duplicidad', field });
  }

  res.status(500).json({ message: 'Error al crear el usuario' });
}

};


// POST /api/register-full para crear usuario y compañia en una misma asi mismo para no ingresar alguno antes de validar 
export const registerCompanyAndUser = async (req: Request, res: Response) => {
  const { company, user } = req.body;

  const t = await sequelize.transaction();
  try {
    // 1. Crear empresa
    const newCompany = await Company.create({
      name: company.name,
      address: company.address,
      contactEmail: company.contactEmail,
      subdomain: company.subdomain
    }, { transaction: t });

    // 2. Crear usuario
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser = await User.create({
      companyId: newCompany.id,
      username: user.username,
      password: hashedPassword,
      role: 'admin',
      isDelivery: false,
      isActive: true
    }, { transaction: t });

    await t.commit();
    return res.status(201).json({ message: 'Registro completo', company: newCompany, user: newUser });

  } catch (error: any) {
    await t.rollback();

    if (error.name === 'SequelizeUniqueConstraintError') {
      const field = error.errors?.[0]?.path;

      let message = 'Error de duplicidad';
      if (field === 'subdomain') message = 'El subdominio ya está en uso.';
      if (field === 'contactEmail') message = 'Ese correo ya está registrado.';
      if (field === 'name') message = 'El nombre de empresa ya está registrado.';
      if (field === 'username') message = 'El nombre de usuario ya está registrado.';

      return res.status(400).json({ message, field });
    }

    console.error(error);
    return res.status(500).json({ message: 'Error creando empresa y usuario' });
  }
};
