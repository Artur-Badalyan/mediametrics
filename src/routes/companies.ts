import { Router } from 'express';

import company from '#src/controllers/companies';
import { authenticateJWT, requireRole } from '#src/middlewares/authMiddleware';
import constants from '#src/constants';

const { ADMIN } = constants.USERS_ROLES;

export default (app: Router) => {
  app.route('/companies')
    .post(authenticateJWT, requireRole(ADMIN), company.create);
};