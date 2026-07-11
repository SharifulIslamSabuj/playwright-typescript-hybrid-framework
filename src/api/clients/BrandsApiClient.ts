import { BaseApiClient } from './BaseApiClient';
import { apiEndpoints } from '../endpoints';

export class BrandsApiClient extends BaseApiClient {
  async getAllBrands() {
    return this.get(apiEndpoints.brandsList);
  }

  async putBrandsList() {
    return this.put(apiEndpoints.brandsList);
  }
}
