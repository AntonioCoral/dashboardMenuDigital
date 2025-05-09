"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http")); // Asegúrate de importar https en lugar de http
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const conecction_1 = __importDefault(require("../db/conecction"));
const orden_1 = __importDefault(require("../routes/orden"));
const cliente_1 = __importDefault(require("../routes/cliente"));
const caja_1 = __importDefault(require("../routes/caja"));
const _1 = require(".");
const company_1 = __importDefault(require("../routes/company"));
const auth_1 = __importDefault(require("../routes/auth"));
const contactInfoRoutes_1 = __importDefault(require("../routes/contactInfoRoutes"));
const categoryRoutes_1 = __importDefault(require("../routes/categoryRoutes"));
const productRoutes_1 = __importDefault(require("../routes/productRoutes"));
const carouselRoutes_1 = __importDefault(require("../routes/carouselRoutes"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.port = process.env.PORT || '500';
        // Crear servidor HTTPS
        this.server = http_1.default.createServer(this.app);
        this.io = new socket_io_1.Server(this.server, {
            cors: {
                origin: '*',
            },
        });
        // Agregar io al contexto de la aplicación
        this.app.set('socketio', this.io);
        this.listen();
        this.middlewares();
        this.routes();
        this.dbConnect();
        this.sockets();
    }
    listen() {
        (0, _1.syncDatabase)().then(() => {
            this.server.listen(this.port, () => {
                console.log('Aplicación corriendo en el puerto:', this.port);
            });
        });
    }
    routes() {
        this.app.get('/', (req, res) => {
            res.json({ msg: 'API trabajando' });
        });
        // Pasar io como parte del contexto a las rutas
        this.app.use('/api/ordenes', (0, orden_1.default)(this.io));
        this.app.use('/api/clientes', cliente_1.default);
        this.app.use('/api/caja', caja_1.default);
        this.app.use('/api/companies', company_1.default);
        this.app.use('/api/categories', categoryRoutes_1.default);
        this.app.use('/api/auth', auth_1.default); // Ruta de autenticación
        this.app.use('/api/products', productRoutes_1.default);
        this.app.use('/api/carousel', carouselRoutes_1.default);
        this.app.use('/api/contact', contactInfoRoutes_1.default); //Ruta para informacion de contacto
        // Servir archivos estáticos desde la carpeta 'uploads'
        this.app.use('/api/uploads', express_1.default.static(path_1.default.join(__dirname, '../../uploads')));
    }
    middlewares() {
        this.app.use(express_1.default.json());
        this.app.use((0, cors_1.default)());
    }
    dbConnect() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield conecction_1.default.authenticate();
                console.log('Conexión exitosa a la base de datos');
            }
            catch (error) {
                console.log(error);
                console.log('Error al intentar conectarse a la base de datos');
            }
        });
    }
    sockets() {
        this.io.on('connection', (socket) => {
            console.log('Usuario conectado');
            socket.on('disconnect', (reason) => {
                console.log(`User disconnected: ${reason}`);
            });
        });
    }
}
exports.default = Server;
