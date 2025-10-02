import { Request, Response } from 'express';

import { formatError } from '#src/helpers/error';
import log from '#src/helpers/logger/logger';
import { authenticate } from '#src/services/authService';
import { logAction } from '#src/services/auditLogService';
import constants from '#src/constants';

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     description: Authenticate user and return a JWT token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: admin@demo.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: password123
 *     responses:
 *       '200':
 *         description: Successful operation
 */
export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json(formatError('INVALID_INPUT', 'Email and password are required'));
    }
    const authResult = await authenticate(email, password);
    if (!authResult || !authResult.token) {
      return res.status(401).json(formatError('AUTH_FAILED', 'Authentication failed'));
    }
    const { token, user } = authResult;
    logAction(user.id, constants.LOG_ACTION_TYPES.LOGIN, 'USER', user.id, { email });
    res.json({ token });
  } catch (error: unknown) {
    log.error('controllers::auth::login::generic', error);
    res.status(500).json(formatError('INTERNAL_ERROR', 'Internal server error'));
  }
}

export default {
  login,
};
