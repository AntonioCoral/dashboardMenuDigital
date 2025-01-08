"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const corte_1 = require("../controllers/corte");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
// Aplica el middleware a todas las rutas
router.post('/', authMiddleware_1.authenticate, corte_1.createCaja);
router.get('/date/:date', authMiddleware_1.authenticate, corte_1.getCortesByDate);
router.put('/:cajaId/pedidos/:pedidoId', corte_1.actualizarPedidoTransito);
router.get('/transferencias/:numeroCaja/:date', authMiddleware_1.authenticate, corte_1.getTransferenciasByCajaAndDate);
router.get('/ultimo-corte/:numeroCaja', authMiddleware_1.authenticate, corte_1.getUltimoCorteByCaja);
router.put('/:corteId', authMiddleware_1.authenticate, corte_1.actualizarCorte);
exports.default = router;
