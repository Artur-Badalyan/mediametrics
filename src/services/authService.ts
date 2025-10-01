import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { prisma } from "#src/app";
import { User } from "@prisma/client";

const JWT_SECRET = process.env.JWT_SECRET || "media-metrics-secret";

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
    JWT_SECRET,
    { expiresIn: "1d" }
  );

  return {
    user,
    token,
  };
}