
export interface Session {
    user?: {
      id?: string | null;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
  

  // types.ts
export type Config = {
  user_id: string;
  name: string;
  address: string;
  city: string;
  phone1: string;
  phone2: string;
  email: string;
  logo_url?: string;
  created_at: string;
  updated_at: string;
};

export type Customer = {
  _id: string;
  user_id: string;
  email: string;
  phone: string;
  street_address: string;
  city: string;
  state: string;
  country: string;
  first_name: string;
  last_name: string;
  created_at: string;
  updated_at: string;
};

export type Product = {
  quantity: any;
  _id: string;
  user_id: string;
  name: string;
  currency: string;
  category: string;
  price: number;
  product_image?: string;
  discount: number;
  created_at: string;
  updated_at: string;
};

export type InvoiceItem = {
  product: Product;
  quantity: number;
};
