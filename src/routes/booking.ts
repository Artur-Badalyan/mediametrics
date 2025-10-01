import { Application } from 'express';

import booking from '#src/controllers/booking';
import { authenticateJWT, requireRole } from '#src/middlewares/authMiddleware';
import constants from '#src/constants';

export default (app: Application) => {
  // TODO: role change
  app.route('/booking')
    .post(authenticateJWT, requireRole(constants.USERS_ROLES.ADMIN), booking.create);
};