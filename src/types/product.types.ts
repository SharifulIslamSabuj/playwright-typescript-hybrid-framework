export interface Product {
  id: number;
  name: string;
  price: string;
  brand?: string;
  category?: string;
}

export interface ProductSearchData {
  searchTerm: string;
  expectedResultsContain?: string;
}

export interface CartItem {
  productName: string;
  quantity: number;
  price?: string;
}

export interface CardDetails {
  cardNumber: string;
  cardHolderName: string;
  cvc: string;
  expiryMonth: string;
  expiryYear: string;
}

export interface CheckoutData {
  orderComment?: string;
  card: CardDetails;
}
