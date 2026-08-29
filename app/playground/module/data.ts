import { faker } from "@faker-js/faker";
import { Product, products, SaleStatus, saleStatuses } from "./constants";

export type Sale = {
  id: string;
  customerName: string;
  customerEmail: string;
  salesRep: string | null;
  notes: string;
  amount: number;
  isPaid: boolean;
  purchasedAt: Date;
  status: SaleStatus;
  products: Product[];
  shippingAddress: {
    city: string;
    country: string;
  };
  deliveryPeriod: {
    from: Date;
    to: Date;
  };
  availableDates: Date[];
  preferredTime: string;
  deliveryTimes: string[];
};

const randomItem = <T>(items: readonly T[]): T => {
  return faker.helpers.arrayElement(items);
};

const randomItems = <T>(items: readonly T[], min: number, max: number): T[] => {
  const count = faker.number.int({ min, max });
  return faker.helpers.arrayElements(items, count);
};

const randomDateRange = () => {
  const from = faker.date.soon({ days: 14 });
  const to = faker.date.soon({ days: 7, refDate: from });
  return { from, to };
};

const randomTime = () => {
  const hour = faker.number.int({ min: 8, max: 21 });
  const minute = faker.helpers.arrayElement([0, 15, 30, 45]);
  return `${hour.toString().padStart(2, "0")}:${minute
    .toString()
    .padStart(2, "0")}`;
};

const randomTimes = () => {
  const times = Array.from(
    { length: faker.number.int({ min: 1, max: 4 }) },
    randomTime,
  );

  return [...new Set(times)].sort();
};

const randomDates = () => {
  const count = faker.number.int({ min: 1, max: 4 });
  const dates = Array.from({ length: count }, () =>
    faker.date.soon({ days: 30 }),
  );
  return dates.sort((a, b) => a.getTime() - b.getTime());
};

const randomAmount = (status: SaleStatus) => {
  if (status === "Refunded") {
    return -faker.number.float({
      min: 20,
      max: 2500,
      fractionDigits: 2,
    });
  }
  return faker.number.float({
    min: 25,
    max: 15000,
    fractionDigits: 2,
  });
};

export const createSale = (): Sale => {
  const status = randomItem(saleStatuses);
  const deliveryPeriod = randomDateRange();

  return {
    id: faker.string.uuid(),
    customerName: faker.person.fullName(),
    customerEmail: faker.internet.email(),
    // Some sales don't have an assigned representative yet.
    salesRep: faker.datatype.boolean({ probability: 0.8 })
      ? faker.person.fullName()
      : null,
    notes: faker.lorem.paragraph({ min: 1, max: 3 }),
    amount: randomAmount(status),
    isPaid:
      status === "Refunded"
        ? true
        : faker.datatype.boolean({ probability: 0.75 }),
    purchasedAt: faker.date.recent({ days: 30 }),
    status,
    products: randomItems(products, 1, 5),
    shippingAddress: {
      city: faker.location.city(),
      country: faker.location.country(),
    },
    deliveryPeriod,
    availableDates: randomDates(),
    preferredTime: randomTime(),
    deliveryTimes: randomTimes(),
  };
};

export const generateSales = (count: number) =>
  faker.helpers.multiple(createSale, { count });
