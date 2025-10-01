import { prisma } from "#src/app";
import log from '#src/helpers/logger/logger';

export async function logAction(
  userId: string,
  action: string,
  targetType: string,
  targetId: string,
  meta?: object
) {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        targetType,
        targetId,
        meta: meta || {},
      },
    });
  } catch (error) {
    log.error('services::auditLogService::logAction::error', error);
  }
}