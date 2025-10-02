import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { prisma } from "#src/app";
import { User } from "@prisma/client";
import settings from "#src/settings";

export async function authenticate(email: string, password: string): Promise<{ user: User; token: string } | null> {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return null;

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      companyId: user.companyId
    },
    settings.jwtSecret,
    { expiresIn: "1d" }
  );

  return {
    user,
    token,
  };
}