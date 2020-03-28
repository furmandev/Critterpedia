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
