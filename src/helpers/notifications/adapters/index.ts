import fs from 'fs';
import path from 'path';
import pupa from 'pupa';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function notifyBookingCreated(to: string, context: Record<string, any>): void {
  const templatePath = path.join(__dirname, '../', 'templates', 'booking_created.txt');
  const template = fs.readFileSync(templatePath, 'utf-8');
  const message = pupa(template, context);
  // Here you would integrate with an email service to send the email
  console.log(`Sending email to ${to}:\n${message}`);
}

export function reminderBooking(to: string, context: Record<string, any>): void {
  const templatePath = path.join(__dirname, '../', 'templates', 'booking_reminder.txt');
  const template = fs.readFileSync(templatePath, 'utf-8');
  const message = pupa(template, context);
  // Here you would integrate with an email service to send the email
  console.log(`Sending reminder email to ${to}:\n${message}`);
}
