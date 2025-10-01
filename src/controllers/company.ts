import { Request, Response } from "express";
import { prisma } from "#src/app";
import { formatError } from "#src/helpers/error";
import { logAction } from "#src/services/auditLogService";
import constants from "#src/constants";

async function create(req: Request, res: Response) {
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
}

export default {
  create
};