import moment from 'moment';
import constants from '#src/constants';

interface OpeningHours {
  [key: string]: [number, number];
}

export interface BookingSettings {
  allowSameDay: boolean;
  allowNextDay: boolean;
  openingHours: OpeningHours;
}

function isWithinOpeningHours(openingHours: OpeningHours, date: Date): boolean {
  const day = constants.WEEK_DAYS[date.getUTCDay()];
  const hours = openingHours[day];
  if (!hours || hours.length !== 2) return false;
  const hour = date.getUTCHours();
  return hour >= hours[0] && hour < hours[1];
}

export function validateBookingDate(
  settings: BookingSettings,
  bookingDate: Date,
  now: Date = new Date()
): { valid: boolean; errorCode: string; message: string } {
  if (bookingDate < now) {
    return {
      valid: false,
      errorCode: 'BOOKING_RULE_VIOLATION',
      message: 'Booking in the past',
    };
  }

  if (
    !settings.allowSameDay &&
    bookingDate.toDateString() === now.toDateString()
  ) {
    return {
      valid: false,
      errorCode: 'BOOKING_RULE_VIOLATION',
      message: 'Same-day booking not allowed',
    };
  }

  const nextDay = new Date(now);
  nextDay.setDate(now.getDate() + 1);
  if (!settings.allowNextDay && moment(bookingDate).isSame(nextDay, 'day')) {
    return {
      valid: false,
      errorCode: 'BOOKING_RULE_VIOLATION',
      message: 'Next-day booking not allowed',
    };
  }

  if (!isWithinOpeningHours(settings.openingHours, bookingDate)) {
    return {
      valid: false,
      errorCode: 'BOOKING_RULE_VIOLATION',
      message: 'Booking outside opening hours',
    };
  }

  return { valid: true, errorCode: '', message: '' };
}
