import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "#src/app";
import { formatError } from "#src/helpers/error";
import settings from "#src/settings";

import { User } from "@prisma/client";

const JWT_SECRET = settings.jwtSecret;

export async function authenticateJWT(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json(formatError("UNAUTHORIZED", "Authorization header missing or malformed"));
  }
  const token = authHeader.split(" ")[1];
  try {
    const user = jwt.verify(token, settings.jwtSecret) as User;
    const findUser = await prisma.user.findUnique({ where: { id: user.id } });

    // @ts-ignore
    req.user = findUser;
    next();
  } catch {
    return res.status(401).json(formatError("UNAUTHORIZED", "Token is invalid"));
  }
}

export function requireRole(roles: string | string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore
    const user = req.user;
    const allowed = Array.isArray(roles) ? roles : [roles];
    if (user && allowed.includes(user.role.toLowerCase())) {
      next();
    } else {
      return res.status(403).json(formatError("FORBIDDEN", "Not enough rights"));
    }
  };
}