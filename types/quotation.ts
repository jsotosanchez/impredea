import { Maker, Product } from 'types';

interface QuotationStatus {
  label: string;
}

export interface Quotation {
  id: string;
  updated_at: string;
  quotation_status: QuotationStatus;
  product: Product;
  estimated_date: string;
  maker: Maker;
  price: number;
}
