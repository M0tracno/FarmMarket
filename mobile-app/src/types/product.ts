export interface Product {
  id: string;
  name: string;
  imageUrl: string | number;
  variant: string;
  pricePaise: number;
  mrpPaise: number;
  discountPercent?: number;
  category: string;
}
