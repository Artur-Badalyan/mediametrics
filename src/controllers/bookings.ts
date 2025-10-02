import { Request, Response } from 'express';
import moment from 'moment';

import { prisma } from '#src/app';
import { formatError } from '#src/helpers/error';
import { logAction } from '#src/services/auditLogService';
import constants from '#src/constants';
import { validateBookingDate } from '#src/helpers/bodyValidations/bookingValidations';
import { notifyBookingCreated } from '#src/helpers/notifications/adapters';
import log from '#src/helpers/logger/logger';

/**
 * @swagger
 * /bookings:
 *   get:
 *     summary: Get all bookings for the current company
 *     tags: [Booking]
 *     responses:
 *       200:
 *         description: List of bookings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Booking'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
async function get(req: Request, res: Response) {
  // @ts-ignore
  const { companyId } = req.user;
  try {
    const bookings = await prisma.booking.findMany({
      where: { companyId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
          }
        },
        service: {
          select: {
            id: true,
            name: true,
            description: true
          }
        }
      },
    });
    res.json(bookings);
  } catch (e) {
    res
      .status(500)
      .json(formatError('INTERNAL_ERROR', 'Internal server error'));
  }
}

/**
 * @swagger
 * /bookings:
 *   post:
 *     summary: Create a new booking
 *     tags: [Booking]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookingCreate'
 *     responses:
 *       201:
 *         description: Booking created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *       400:
 *         description: Booking not created or validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Service not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function create(req: Request, res: Response) {
  const { serviceId, datetime } = req.body;
  // @ts-ignore
  const { id: userId, email, companyId } = req.user;
  try {
    const service = await prisma.service.findUnique({
      where: {
        id: serviceId,
        companyId,
      },
      include: {
        company: true,
      },
    });
    if (!service)
      return res
        .status(404)
        .json(formatError('SERVICE_NOT_FOUND', 'Service not found'));

    const settings = service.company.settings as any;
    const bookingDate = new Date(datetime);
    const now = new Date();

    const validation = validateBookingDate(settings, bookingDate, now);
    if (!validation.valid) {
      return res
        .status(400)
        .json(formatError(validation.errorCode, validation.message));
    }

    const booking = await prisma.booking.create({
      data: {
        userId,
        serviceId,
        companyId,
        datetime: bookingDate,
      },
    });
    await prisma.auditLog.create({
        data: {
          userId,
          action: constants.LOG_ACTION_TYPES.CREATE,
          targetType: "BOOKING",
          targetId: booking.id,
          meta: { serviceId, datetime },
        },
    });

    const notifyData = {
      bookingId: booking.id,
      bookingDate: moment(booking.datetime).format('YYYY-MM-DD'),
      bookingTime: moment(booking.datetime).format('HH:mm'),
      serviceName: service.name,
    };
    notifyBookingCreated(email, notifyData);

    logAction(
      userId,
      constants.LOG_ACTION_TYPES.CREATE,
      'BOOKING',
      booking.id,
      { serviceId, datetime }
    );
    res.status(201).json(booking);
  } catch (e) {
    log.error('controllers::booking::create', e);
    res
      .status(400)
      .json(formatError('BOOKING_CREATE_ERROR', 'Booking not created', e));
  }
}

export default {
  get,
  create,
};
