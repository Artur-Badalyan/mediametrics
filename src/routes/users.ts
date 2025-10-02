import { Router } from 'express';

import users from '#src/controllers/users';
import { authenticateJWT } from '#src/middlewares/authMiddleware';

export default (app: Router) => {
  app.route('/users/me')
    .get(authenticateJWT, users.getMe);
};