import winston from 'winston';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { Request } from 'express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logDir = path.join(__dirname, '../../../logs');
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

const { combine, timestamp, errors, json } = winston.format;

const prodFormat = combine(
  errors({ stack: true }),
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  json()
);

const loggerInstance = winston.createLogger({
  level: 'info',
  format: prodFormat,
  transports: [
    new winston.transports.File({ filename: path.join(logDir, 'production.log') }),
  ],
  exitOnError: false,
});

let log: winston.Logger = loggerInstance;

const use = (customLogger: winston.Logger) => (log = customLogger);

const error = (msg: string = '', err: Error | unknown, req?: Request) => {
  let text = msg;

  if (err instanceof Error) {
    text += ` - ${err.message}\n${err.stack}`;
  } else if (err) {
    text += ` - ${JSON.stringify(err)}`;
  }

  log.error(text);
};

const info = (...args: unknown[]) => log.info(args.join(' '));
const warn = (...args: unknown[]) => log.warn(args.join(' '));
const debug = (...args: unknown[]) => log.debug(args.join(' '));
const verbose = (...args: unknown[]) => log.verbose(args.join(' '));
const silly = (...args: unknown[]) => log.silly(args.join(' '));

export default {
  use,
  error,
  info,
  warn,
  debug,
  verbose,
  silly,
  logger: loggerInstance,
};