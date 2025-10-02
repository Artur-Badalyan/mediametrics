import { Router } from 'express';

import service from '#src/controllers/services';
import { authenticateJWT, requireRole } from '#src/middlewares/authMiddleware';
import constants from '#src/constants';

const { ADMIN, STAFF } = constants.USERS_ROLES;

export default (app: Router) => {
  app.route('/services')
    .post(authenticateJWT, requireRole([ADMIN, STAFF]), service.create);
};
