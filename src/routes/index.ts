import express from 'express';
const router = express.Router();

/* configure swagger */
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from '#src/swagger/swagger';

router.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

import auth from '#src/routes/auth';
import users from '#src/routes/users';
import company from '#src/routes/company';
import services from '#src/routes/services';
import booking from '#src/routes/booking';

const routes = [
  auth,
  company,
  users,
  services,
  booking
];

routes.forEach(route => {
  route(router);
});

export default router;