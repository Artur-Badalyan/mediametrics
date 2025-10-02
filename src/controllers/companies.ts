import { Request, Response } from "express";
import { prisma } from "#src/app";
import { logAction } from "#src/services/auditLogService";
import constants from "#src/constants";
import { formatError } from "#src/helpers/error";
import log from "#src/helpers/logger/logger";


/**
 * @swagger
 * /companies:
 *   post:
 *     summary: Create a new company
 *     tags: [Company]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - settings
 *             properties:
 *               name:
 *                 type: string
 *                 example: "NS Corp"
 *               settings:
 *                 type: object
 *                 example: {"allowSameDay": false, "allowNextDay": true, "openingHours": {"mon": [8, 18], "tue": [8, 18], "wed": [8, 18], "thu": [8, 18], "fri": [8, 18], "sat": [10, 16], "sun": []}}
 *     responses:
 *       201:
 *         description: Company created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Company'
 *       400:
 *         description: Bad request, missing name or settings
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
async function create(req: Request, res: Response) {
  try {
    const { name, settings } = req.body;
  if (!name || !settings) {
    return res.status(400).json(formatError("BAD_REQUEST", "Name and settings required"));
  }
  const company = await prisma.company.create({
    data: { name, settings }
  });

  // @ts-ignore
  const { id: userId } = req.user;
  logAction(userId, constants.LOG_ACTION_TYPES.CREATE, 'COMPANY', company.id, { name });
  res.status(201).json(company);
  } catch (e) {
    log.error('controllers::company::create', e);
    res.status(400).json(formatError('BAD_REQUEST', 'Bad request', e));
  }
}

export default {
  create
};