import { Request, Response } from 'express';
import Company from '../models/company';
import User from '../models/user';

// Crear una nueva empresa
export const createCompany = async (req: Request, res: Response) => {
  try {
    const { name, address, contactEmail, subdomain } = req.body;

    const company = await Company.create({ name, address, contactEmail, subdomain });

    res.status(201).json({ message: 'Company created successfully', company });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating company', error });
  }
};

// Obtener todas las empresas
export const getCompanies = async (req: Request, res: Response) => {
  try {
    const companies = await Company.findAll({
      include: [{ model: User, as: 'users' }],
    });

    res.status(200).json(companies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching companies', error });
  }
};

export const getCompanyBySubdomain = async (req: Request, res: Response) => {
  try {
    const { subdomain } = req.params;

    const company = await Company.findOne({ where: { subdomain } });

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    res.status(200).json(company);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching company', error });
  }
};


// Obtener una empresa por ID
export const getCompanyById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const company = await Company.findByPk(id, {
      include: [{ model: User, as: 'users' }],
    });

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    res.status(200).json(company);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching company', error });
  }
};

// Actualizar una empresa
export const updateCompany = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, address, contactEmail } = req.body;

    const company = await Company.findByPk(id);

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    await company.update({ name, address, contactEmail });

    res.status(200).json({ message: 'Company updated successfully', company });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating company', error });
  }
};

// Eliminar una empresa
export const deleteCompany = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const company = await Company.findByPk(id);

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    await company.destroy();

    res.status(200).json({ message: 'Company deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting company', error });
  }
};
