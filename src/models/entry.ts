export interface Entry {
  type: Type;
  name: string;
  image: string;
  num: number;
  price: number;
  activeMonths: string[];
  activeHours: string[];
  location: string;
  weather: string;
  notes: string;
  shadow: string;
  isCaught?: boolean;
}

export enum Type {
  fish,
  bug
}

export function isActive(entry: Entry, hour: string | number, month: string | number) {
  return entry.activeHours.includes(hour.toString()) && entry.activeMonths.includes(month.toString());
}

export function isNew(entry: Entry, currentMonth: string | number) {
  return entry.activeMonths.includes(currentMonth.toString()) && !entry.activeMonths.includes(prevMonth(currentMonth));
}

function prevMonth(month: string | number) {
  month = Number(month.toString());
  month--;
  if (month === 0) { month = 12; }

  return month.toString();
}
