import { Request, Response } from "express";

import { formatError } from "#src/helpers/error";
import { prisma } from "#src/app";

async function getMe(req: Request, res: Response) {
  // @ts-ignore
  const { id } = req.user;
  const user = await prisma.user.findUnique({
    where: { id },
    include: { company: true }
  });
  if (!user) {
    return res.status(404).json(formatError("USER_NOT_FOUND", "User not found"));
  }
  res.json(user);
}

export default {
  getMe
};