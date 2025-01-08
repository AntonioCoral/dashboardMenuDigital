import { Router } from 'express';
import { actualizarCorte, actualizarPedidoTransito, createCaja, getCortesByDate, getTransferenciasByCajaAndDate, getUltimoCorteByCaja } from '../controllers/corte';
import {  validateSubdomain } from '../middlewares/subdomainMiddleware';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

    // Aplica el middleware a todas las rutas

    router.post('/',authenticate, createCaja);
    router.get('/date/:date', authenticate, getCortesByDate);
    router.put('/:cajaId/pedidos/:pedidoId', actualizarPedidoTransito);
    router.get('/transferencias/:numeroCaja/:date',authenticate, getTransferenciasByCajaAndDate);
    router.get('/ultimo-corte/:numeroCaja', authenticate,getUltimoCorteByCaja);
    router.put('/:corteId',authenticate, actualizarCorte);
    
export default router;
