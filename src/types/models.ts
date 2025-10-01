export type CompanySettings = {
  allowSameDay: boolean;
  allowNextDay: boolean;
  openingHours: {
    [day: string]: [number, number] | [];
  };
};

export type User = {
  id: string;
  email: string;
  role: string;
};

export type Service = {
  id: string;
  name: string;
  durationMinutes: number;
  price: number;
};

export type Booking = {
  id: string;
  userId: string;
  serviceId: string;
  companyId: string;
  datetime: Date;
  createdAt: Date;
  updatedAt: Date;
};