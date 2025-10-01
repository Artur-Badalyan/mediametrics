import { Application } from 'express';

import company from '#src/controllers/company';
import { authenticateJWT, requireRole } from '#src/middlewares/authMiddleware';
import constants from '#src/constants';

export default (app: Application) => {
  app.route('/company')
    .post(authenticateJWT, requireRole(constants.USERS_ROLES.ADMIN), company.create);
};