import { Request, Response } from 'express';
import { Server as SocketIOServer } from 'socket.io';
import Orden from '../models/orden';
import { Op } from 'sequelize';
import moment from 'moment-timezone';

// Configurar la zona horaria
const TIMEZONE = 'America/Mexico_City';

export const getOrdenes = async (req: Request, res: Response) => {
  const companyId = req.companyId; // Obtén el companyId del middleware

  if (!companyId) {
    return res.status(401).json({ message: 'Acceso no autorizado' });
  }
    try {
        const today = moment().tz(TIMEZONE).format('YYYY-MM-DD');
        const startOfDay = moment.tz(today, TIMEZONE).startOf('day').toDate();
        const endOfDay = moment.tz(today, TIMEZONE).endOf('day').toDate();

        const listOrden = await Orden.findAll({
            where: {
                companyId,
                createdAt: {
                    [Op.gte]: startOfDay,
                    [Op.lte]: endOfDay
                }
            }
        });

        res.json(listOrden);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al obtener las órdenes' });
    }
};

export const getOrden = async (req: Request, res: Response) => {
    const { id } = req.params;
    const companyId = req.companyId;
  
    if (!companyId) {
      return res.status(401).json({ message: 'Acceso no autorizado' });
    }
  
    try {
      const orden = await Orden.findOne({
        where: {
          id,
          companyId
        }
      });
  
      if (orden) {
        res.json(orden);
      } else {
        res.status(404).json({ msg: 'No existe la orden con la id: ' + id });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: 'Ocurrió un error, intente más tarde' });
    }
  };

export const deleteOrden = async (req: Request, res: Response) => {
    const { id } = req.params;
    const io: SocketIOServer = req.app.get('socketio');
    const orden = await Orden.findByPk(id);

    if (!orden) {
        res.status(404).json({ msg: 'No existe usuario con la id: ' + id });
    } else {
        await orden.destroy();
        io.emit('orderDeleted', id); // Emitir evento de orden eliminada
        res.status(200).json({ msg: 'El usuario ha sido eliminado exitosamente' });
    }
};

export const postOrden = async (req: Request, res: Response) => {
    const { body } = req;
    const companyId = req.companyId;
    const io: SocketIOServer = req.app.get('socketio');
  
    if (!companyId) {
      return res.status(401).json({ message: 'Acceso no autorizado' });
    }
  
    try {
      const newOrder = await Orden.create({
        ...body,
        companyId
      });
      io.emit('orderAdded', newOrder);
      res.json({ msg: 'Orden agregada exitosamente', order: newOrder });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Ocurrió un error, intente más tarde' });
    }
  };

  export const updateOrden = async (req: Request, res: Response) => {
    const { body } = req;
    const { id } = req.params;
    const companyId = req.companyId;
    const io: SocketIOServer = req.app.get('socketio');
  
    try {
      const orden = await Orden.findOne({
        where: {
          id,
          companyId
        }
      });
  
      if (orden) {
        await orden.update(body);
        io.emit('orderUpdated', orden);
        res.json({ msg: 'Orden actualizada con éxito', order: orden });
      } else {
        res.status(404).json({ msg: 'No existe la orden con la id: ' + id });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Ocurrió un error, intente más tarde' });
    }
  };

  export const getOrdenesByDelivery = async (req: Request, res: Response) => {
    const { nameDelivery } = req.params;
    const companyId = req.companyId;
  
    if (!companyId) {
      return res.status(401).json({ message: 'Acceso no autorizado' });
    }
  
    const today = moment().tz(TIMEZONE).format('YYYY-MM-DD');
    const startOfDay = moment.tz(today, TIMEZONE).startOf('day').toDate();
    const endOfDay = moment.tz(today, TIMEZONE).endOf('day').toDate();
  
    try {
      const ordenes = await Orden.findAll({
        where: {
          nameDelivery,
          companyId,
          createdAt: {
            [Op.gte]: startOfDay,
            [Op.lte]: endOfDay
          }
        }
      });
      res.json(ordenes);
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Ocurrió un error, intente más tarde' });
    }
  };

  export const getOrdenesByDate = async (req: Request, res: Response) => {
    const { date } = req.params;
    const companyId = req.companyId;
  
    if (!companyId) {
      return res.status(401).json({ message: 'Acceso no autorizado' });
    }
  
    try {
      const startOfDay = moment.tz(date, TIMEZONE).startOf('day').toDate();
      const endOfDay = moment.tz(date, TIMEZONE).endOf('day').toDate();
  
      const orders = await Orden.findAll({
        where: {
          companyId,
          createdAt: {
            [Op.gte]: startOfDay,
            [Op.lte]: endOfDay
          }
        }
      });
      res.json(orders);
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Error fetching orders' });
    }
  };

  export const getLastOrderNumber = async (req: Request, res: Response) => {
    const { date } = req.params;
    const companyId = req.companyId;
  
    if (!companyId) {
      return res.status(401).json({ message: 'Acceso no autorizado' });
    }
  
    try {
      const startOfDay = moment.tz(date, TIMEZONE).startOf('day').toDate();
      const endOfDay = moment.tz(date, TIMEZONE).endOf('day').toDate();
  
      const lastOrder = await Orden.findOne({
        where: {
          companyId,
          createdAt: {
            [Op.gte]: startOfDay,
            [Op.lte]: endOfDay
          }
        },
        order: [['numerOrden', 'DESC']]
      });
  
      const lastOrderNumber = lastOrder ? lastOrder.numerOrden : 0;
      res.json({ lastOrderNumber });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Error fetching last order number' });
    }
  };
  
  export const checkOrderNumberExists = async (req: Request, res: Response) => {
    const { orderNumber } = req.params;
    const companyId = req.companyId;
  
    if (!companyId) {
      return res.status(401).json({ message: 'Acceso no autorizado' });
    }
  
    try {
      const order = await Orden.findOne({
        where: {
          numerOrden: orderNumber,
          companyId
        }
      });
  
      res.json(!!order);
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Error checking order number' });
    }
  };
  
  export const getTransferenciasByCajaAndTimeRange = async (req: Request, res: Response) => {
    const { numeroCaja, date, startTime, endTime } = req.params;
    const companyId = req.companyId;
  
    if (!companyId) {
      return res.status(401).json({ message: 'Acceso no autorizado' });
    }
  
    try {
      const startDateTimeLocal = moment.tz(`${date} ${startTime}`, TIMEZONE);
      const endDateTimeLocal = moment.tz(`${date} ${endTime}`, TIMEZONE);
  
      const startDateTimeUTC = startDateTimeLocal.clone().utc().toDate();
      const endDateTimeUTC = endDateTimeLocal.clone().utc().toDate();
  
      const transferencias = await Orden.findAll({
        where: {
          numeroCaja,
          companyId,
          createdAt: {
            [Op.gte]: startDateTimeUTC,
            [Op.lte]: endDateTimeUTC
          },
          transferenciaPay: {
            [Op.gt]: 0
          }
        },
        attributes: ['transferenciaPay']
      });
  
      res.json(transferencias);
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Error fetching transferencias' });
    }
  };
  
  export const getPedidosTransitoByCajaAndTimeRange = async (req: Request, res: Response) => {
    const { numeroCaja, date, startTime, endTime } = req.params;
    const companyId = req.companyId;
  
    if (!companyId) {
      return res.status(401).json({ message: 'Acceso no autorizado' });
    }
  
    try {
      const startDateTimeLocal = moment.tz(`${date} ${startTime}`, TIMEZONE);
      const endDateTimeLocal = moment.tz(`${date} ${endTime}`, TIMEZONE);
  
      const startDateTimeUTC = startDateTimeLocal.clone().utc().toDate();
      const endDateTimeUTC = endDateTimeLocal.clone().utc().toDate();
  
      const pedidosTransito = await Orden.findAll({
        where: {
          numeroCaja,
          companyId,
          createdAt: {
            [Op.gte]: startDateTimeUTC,
            [Op.lte]: endDateTimeUTC
          },
          status: 'transito'
        },
        attributes: ['efectivo', 'nameClient']
      });
  
      res.json(pedidosTransito);
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Error fetching pedidos en transito' });
    }
  };
  
  

