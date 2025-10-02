import moment from "moment";
import { prisma } from "#src/app";
import { reminderBooking } from "#src/helpers/notifications/adapters";
import log from "#src/helpers/logger/logger";
import settings from "#src/settings";

export async function sendBookingReminders() {
  const now = new Date();
  // Find bookings scheduled in 2 hours from now, in the next interval
  const soon = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 hours
  const windowEnd = new Date(soon.getTime() + settings.scheduleIntervalInMinutes * 60 * 1000);

  const bookings = await prisma.booking.findMany({
    where: {
      datetime: {
        gte: soon,
        lt: windowEnd,
      },
      isRemindered: false,
    },
    include: { user: true, service: true },
  });

  for (const booking of bookings) {
    if (booking.user?.email) {
      const data = {
        bookingId: booking.id,
        bookingDate: moment(booking.datetime).format('YYYY-MM-DD'),
        bookingTime: moment(booking.datetime).format('HH:mm'),
        serviceName: booking.service.name || 'N/A',
      };
      reminderBooking(booking.user.email, data);
      log.info(`Reminder sent to ${booking.user.email} about booking ${booking.id}`);

      await prisma.booking.update({
        where: { id: booking.id },
        data: { isRemindered: true },
      });
    }
  }
}