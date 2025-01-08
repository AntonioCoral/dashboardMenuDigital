import { Router } from 'express';
import { getOrdenes, getOrden, deleteOrden, postOrden, updateOrden, checkOrderNumberExists, getTransferenciasByCajaAndTimeRange, getPedidosTransitoByCajaAndTimeRange } from '../controllers/orden';
import { getOrdenesByDelivery, getOrdenesByDate, getLastOrderNumber } from '../controllers/orden';
import { authenticate } from '../middlewares/authMiddleware';
import { Server as SocketIOServer } from 'socket.io';
import { getTransferenciasByCajaAndDate } from '../controllers/corte';

export default (io: SocketIOServer) => {
    const router = Router();

    router.get('/',authenticate, getOrdenes);
    router.get('/:id', authenticate, getOrden);
    router.delete('/:id',authenticate, deleteOrden);
    router.post('/',authenticate, (req, res) => postOrden(req, res));
    router.put('/:id',authenticate, (req, res) => updateOrden(req, res));
    router.get('/delivery/:nameDelivery',authenticate, getOrdenesByDelivery);
    router.get('/date/:date',authenticate, getOrdenesByDate);
    router.get('/lastOrderNumber/:date',authenticate, getLastOrderNumber);
    router.get('/checkOrderNumber/:orderNumber',authenticate, checkOrderNumberExists);
    router.get('/transferencias/:numeroCaja/:date/:startTime/:endTime',authenticate, getTransferenciasByCajaAndTimeRange);
    router.get('/transito/:numeroCaja/:date/:startTime/:endTime',authenticate, getPedidosTransitoByCajaAndTimeRange);
    
    


    return router;
};
