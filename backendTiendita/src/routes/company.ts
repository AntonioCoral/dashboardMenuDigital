import { Router } from 'express';
import {
  createCompany,
  getCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
  getCompanyBySubdomain,
} from '../controllers/company';

const router = Router();

// Crear una nueva empresa
router.post('/', createCompany);

// Obtener todas las empresas
router.get('/', getCompanies);

// Obtener una empresa por ID
router.get('/:id', getCompanyById);

// Actualizar una empresa
router.put('/:id', updateCompany);

// Obtener una empresa por subdominio
router.get('/subdomain/:subdomain', getCompanyBySubdomain); // Nueva ruta

// Eliminar una empresa
router.delete('/:id', deleteCompany);

export default router;
