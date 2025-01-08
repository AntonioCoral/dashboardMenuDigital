// src/types/express.d.ts
import { JwtPayload } from 'jsonwebtoken';
import { Company } from '../models/company';

declare global {
  namespace Express {
    interface Request {
      user?: string | JwtPayload; // Ajusta según la estructura de tu JWT
    }
  }
}
declare global {
  namespace Express {
    interface Request {
      company?: Company;
    }
  }
}


declare global {
  namespace Express {
    export interface Request {
      companyId?: number; // O el tipo correcto según el diseño
    }
  }
}
