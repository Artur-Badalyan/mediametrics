import scheduleJob from "#src/services/scheduleJob";
import { sendBookingReminders } from "#src/services/bookingReminder";
import settings from "#src/settings";

export function scheduleInit() {
  scheduleJob("BookingReminders", settings.scheduleInterval, async () => {
    await sendBookingReminders();
  });
}
