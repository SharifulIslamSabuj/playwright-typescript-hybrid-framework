export interface ApiResponse {
  responseCode: number;
  message?: string;
}

export interface ApiProduct {
  id: number;
  name: string;
  price: string;
  brand: string;
  category: {
    usertype: { usertype: string };
    category: string;
  };
}

export interface ApiBrand {
  id: number;
  brand: string;
}

export interface ProductsListResponse extends ApiResponse {
  products: ApiProduct[];
}

export interface SearchProductResponse extends ApiResponse {
  products: ApiProduct[];
}

export interface BrandsListResponse extends ApiResponse {
  brands: ApiBrand[];
}

export interface VerifyLoginResponse extends ApiResponse {
  message: string;
}
