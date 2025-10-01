import { Request, Response } from "express";

import { formatError } from "#src/helpers/error";
import { logAction } from "#src/services/auditLogService";
import constants from "#src/constants";
import { prisma } from "#src/app";

async function create(req: Request, res: Response) {
  const { name, description } = req.body;
  // @ts-ignore
  const { id: userId, companyId } = req.user;
  try {
    const service = await prisma.service.create({
      data: {
        name,
        description,
        companyId
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