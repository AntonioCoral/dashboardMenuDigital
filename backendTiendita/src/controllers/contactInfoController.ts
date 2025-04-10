import { Request, Response } from 'express';
import ContactInfo from '../models/contactInfo.model';
import { Company } from '../models';

// Obtener la información de contacto
export const getContactInfo = async (req: Request, res: Response) => {
  try {
    const companyId = req.companyId;

    if (!companyId) {
      return res.status(403).json({ message: 'Acceso no autorizado: Compañía no encontrada' });
    }

    const contactInfo = await ContactInfo.findOne({
      where: { companyId },
      order: [['id', 'DESC']],
    });

    res.status(200).json(contactInfo || {});
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la información de contacto', error });
  }
};


// Actualizar o crear la información de contacto
export const updateContactInfo = async (req: Request, res: Response) => {
  try {
    const companyId = req.companyId;

    if (!companyId) {
      return res.status(403).json({ message: 'Acceso no autorizado: Compañía no encontrada' });
    }

    const { phoneNumber, ubication, openedTime, bankAccount, clabe, bankName, accountHolder } = req.body;

    const [contactInfo] = await ContactInfo.findOrCreate({
      where: { companyId },
      defaults: {
        companyId,
        phoneNumber,
        ubication,
        openedTime,
        bankAccount,
        clabe,
        bankName,
        accountHolder,
      },
    });

    await contactInfo.update({
      phoneNumber,
      ubication,
      openedTime,
      bankAccount,
      clabe,
      bankName,
      accountHolder,
    });

    res.status(200).json({ message: 'Información de contacto actualizada', contactInfo });
  } catch (error) {
    console.error('Error al actualizar la información de contacto:', error);
    res.status(500).json({ message: 'Error al actualizar la información de contacto', error });
  }
};


// Obtener la información de contacto desde MENU DIGITAL
export const getContactInfoMenu = async (req: Request, res: Response) => {
  try {
    const subdomain = req.query.subdomain as string;

    if (!subdomain) {
      return res.status(400).json({ message: 'Subdominio requerido' });
    }

    const company = await Company.findOne({ where: { subdomain } });

    if (!company) {
      return res.status(404).json({ message: 'Empresa no encontrada' });
    }

    const contactInfo = await ContactInfo.findOne({
      where: { companyId: company.id },
      order: [['id', 'DESC']],
    });

    res.status(200).json(contactInfo || {});
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la información de contacto', error });
  }
};