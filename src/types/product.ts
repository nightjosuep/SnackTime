export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  emoji: string;
  color: string;
  calories?: number;
  tags?: string[];
  allergens?: string[];
  ingredients?: string[];
};
