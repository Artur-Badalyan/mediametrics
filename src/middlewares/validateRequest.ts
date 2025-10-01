import { z, ZodError } from 'zod';
import { Request, Response, NextFunction } from 'express';

interface ValidatedRequest<T> extends Request {
  validated?: T;
}

const formatZodErrors = (err: ZodError) => z.flattenError(err).fieldErrors;

export const validateBody =
  <T>(schema: z.ZodSchema<T>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (err: unknown) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Body validation failed',
            details: formatZodErrors(err),
          },
        });
      }
      return res
        .status(500)
        .json({
          error: { code: 'INTERNAL_ERROR', message: 'Unexpected error' },
        });
    }
  };

export const validateQuery =
  <T>(schema: z.ZodSchema<T>) =>
  async (req: ValidatedRequest<T>, res: Response, next: NextFunction) => {
    try {
      req.validated = await schema.parseAsync(req.query);
      next();
    } catch (err: unknown) {
      if (err instanceof ZodError) {
        return res.status(400).json({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Query validation failed',
            details: formatZodErrors(err),
          },
        });
      }
      return res.status(500).json({
        error: { code: 'INTERNAL_ERROR', message: 'Unexpected error' },
      });
    }
  };

export const validateParams =
  <T>(schema: z.ZodSchema<T>) =>
  async (req: any, res: Response, next: NextFunction) => {
    try {
      req.params = await schema.parseAsync(req.params);
      next();
    } catch (err: unknown) {
      if (err instanceof ZodError) {
        return res.status(400).json({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Params validation failed',
            details: formatZodErrors(err),
          },
        });
      }
      return res.status(500).json({
        error: { code: 'INTERNAL_ERROR', message: 'Unexpected error' },
      });
    }
  };
