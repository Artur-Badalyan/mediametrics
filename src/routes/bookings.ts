import { Application } from 'express';

import booking from '#src/controllers/bookings';
import { authenticateJWT, requireRole } from '#src/middlewares/authMiddleware';
import constants from '#src/constants';

const { ENUM, ADMIN, STAFF } = constants.USERS_ROLES;

export default (app: Application) => {
  app.route('/bookings')
    .get(authenticateJWT, requireRole([ADMIN, STAFF]), booking.get);
  app.route('/bookings')
    .post(authenticateJWT, requireRole(ENUM), booking.create);
};