import { BaseApiClient } from './BaseApiClient';
import { apiEndpoints } from '../endpoints';

export class ProductsApiClient extends BaseApiClient {
  async getAllProducts() {
    return this.get(apiEndpoints.productsList);
  }

  async searchProduct(searchTerm: string) {
    return this.post(apiEndpoints.searchProduct, { search_product: searchTerm });
  }

  async postProductsList() {
    return this.post(apiEndpoints.productsList);
  }

  async searchProductWithoutParam() {
    return this.post(apiEndpoints.searchProduct);
  }
}
