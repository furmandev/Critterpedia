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
