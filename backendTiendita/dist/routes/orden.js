"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orden_1 = require("../controllers/orden");
const orden_2 = require("../controllers/orden");
const authMiddleware_1 = require("../middlewares/authMiddleware");
exports.default = (io) => {
    const router = (0, express_1.Router)();
    router.get('/', authMiddleware_1.authenticate, orden_1.getOrdenes);
    router.get('/:id', authMiddleware_1.authenticate, orden_1.getOrden);
    router.delete('/:id', authMiddleware_1.authenticate, orden_1.deleteOrden);
    router.post('/', authMiddleware_1.authenticate, (req, res) => (0, orden_1.postOrden)(req, res));
    router.put('/:id', authMiddleware_1.authenticate, (req, res) => (0, orden_1.updateOrden)(req, res));
    router.get('/delivery/:nameDelivery', authMiddleware_1.authenticate, orden_2.getOrdenesByDelivery);
    router.get('/date/:date', authMiddleware_1.authenticate, orden_2.getOrdenesByDate);
    router.get('/lastOrderNumber/:date', authMiddleware_1.authenticate, orden_2.getLastOrderNumber);
    router.get('/checkOrderNumber/:orderNumber', authMiddleware_1.authenticate, orden_1.checkOrderNumberExists);
    router.get('/transferencias/:numeroCaja/:date/:startTime/:endTime', authMiddleware_1.authenticate, orden_1.getTransferenciasByCajaAndTimeRange);
    router.get('/transito/:numeroCaja/:date/:startTime/:endTime', authMiddleware_1.authenticate, orden_1.getPedidosTransitoByCajaAndTimeRange);
    return router;
};
