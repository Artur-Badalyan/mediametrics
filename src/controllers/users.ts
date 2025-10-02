import { Request, Response } from 'express';

import { formatError } from '#src/helpers/error';
import { prisma } from '#src/app';

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Get current authenticated user
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: The current user object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 email:
 *                   type: string
 *                 name:
 *                   type: string
 *                 company:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
async function getMe(req: Request, res: Response) {
  // @ts-ignore
  const { id } = req.user;
  const user = await prisma.user.findUnique({
    where: { id },
    include: { company: true },
  });
  if (!user) {
    return res
      .status(404)
      .json(formatError('USER_NOT_FOUND', 'User not found'));
  }
  res.json(user);
}

export default {
  getMe,
};
