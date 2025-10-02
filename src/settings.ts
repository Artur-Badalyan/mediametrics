export default {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT ? parseInt(process.env.PORT) : 4000,
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret',
  databaseUrl: process.env.DATABASE_URL || 'your_database_url',
  scheduleInterval: process.env.SCHEDULE_INTERVAL || '*/15 * * * *', // every 15 minutes
  scheduleIntervalInMinutes: process.env.SCHEDULE_INTERVAL_IN_MINUTES ? parseInt(process.env.SCHEDULE_INTERVAL_IN_MINUTES) : 15,
}