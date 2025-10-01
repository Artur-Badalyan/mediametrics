import settings from '#src/settings';

let loggerModule;

if (settings.env === 'production') {
  loggerModule = await import('./logger.production');
} else {
  loggerModule = await import('./logger.development');
}

export default loggerModule.default;