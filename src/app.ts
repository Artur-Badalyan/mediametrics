import express from 'express';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

import { scheduleInit } from '#src/jobs';
import log from '#src/helpers/logger/logger';
import routes from '#src/routes/index';

dotenv.config({ quiet: true });

const app = express();

app.use(express.json());
app.set('logger', log);

app.use('/api', routes);

scheduleInit();

export const prisma = new PrismaClient();
export default app;
