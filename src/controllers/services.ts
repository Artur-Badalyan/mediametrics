import { Request, Response } from "express";

import { formatError } from "#src/helpers/error";
import { logAction } from "#src/services/auditLogService";
import constants from "#src/constants";
import { prisma } from "#src/app";


/**
 * @swagger
 * /services:
 *   post:
 *     summary: Create a new service
 *     tags:
 *       - Services
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Medical"
 *               description:
 *                 type: string
 *                 example: "General health checkup"
 *               selectedCompanyId:
 *                 type: string
 *                 example: "companyId123" # Only for admin users
 *     responses:
 *       201:
 *         description: Service created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Service'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
async function create(req: Request, res: Response) {
  const { name, description, selectedCompanyId } = req.body;
  // @ts-ignore
  const { id: userId, role, companyId } = req.user;
  try {
    const targetCompanyId = role === constants.USERS_ROLES.ADMIN && selectedCompanyId ? selectedCompanyId : companyId;

    const service = await prisma.service.create({
      data: {
        name,
        description,
        companyId: targetCompanyId
      }
    });

    logAction(userId, constants.LOG_ACTION_TYPES.CREATE, 'SERVICE', service.id, { name, description });
    res.status(201).json(service);
  } catch (e) {
    res.status(400).json(formatError('BAD_REQUEST', 'Bad request', e));
  }
}

export default {
  create
};