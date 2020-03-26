export interface Entry {
  type: Type;
  name: string;
  image: string;
  num: number;
  price: number;
  activeMonths: number[];
  activeHours: number[];
  location: string;
  weather: string;
  notes: string;
  shadow: string;
}

export enum Type {
  fish,
  bug
}
