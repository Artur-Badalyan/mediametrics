export default {
  USERS_ROLES: {
    ENUM: ['admin', 'staff', 'customer'] as string[],
    ADMIN: 'admin',
    STAFF: 'staff',
    CUSTOMER: 'customer'
  },
  LOG_ACTION_TYPES: {
    ENUM: ['create', 'update', 'delete', 'login', 'logout'] as const,
    CREATE: 'create',
    UPDATE: 'update',
    DELETE: 'delete',
    LOGIN: 'login',
    LOGOUT: 'logout'
  },
  WEEK_DAYS: ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const,
}