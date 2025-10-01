import { Application } from 'express';

import service from '#src/controllers/services';
import { authenticateJWT, requireRole } from '#src/middlewares/authMiddleware';
import constants from '#src/constants';

export default (app: Application) => {
  app.route('/services')
    .post(authenticateJWT, requireRole(constants.USERS_ROLES.ADMIN), service.create);
};