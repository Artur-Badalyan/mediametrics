import { Application } from 'express';

import auth from '#src/controllers/auth';
import { validateBody } from '#src/middlewares/validateRequest';
import { loginSchema } from '#src/schemas/auth';

export default (app: Application) => {
  app.route('/auth/login')
    .post(validateBody(loginSchema), auth.login);
};