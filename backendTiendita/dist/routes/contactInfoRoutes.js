"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const contactInfoController_1 = require("../controllers/contactInfoController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
router.get('/', authMiddleware_1.authenticate, contactInfoController_1.getContactInfo);
router.post('/', authMiddleware_1.authenticate, contactInfoController_1.updateContactInfo);
/////////////////RUTA PARA MENU DIGITAL/////////////////
router.get('/menu', contactInfoController_1.getContactInfoMenu);
exports.default = router;
