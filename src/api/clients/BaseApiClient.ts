import { APIRequestContext, APIResponse } from '@playwright/test';

export class BaseApiClient {
  protected readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  protected async get(url: string, params?: Record<string, string>): Promise<APIResponse> {
    return this.request.get(url, { params });
  }

  protected async post(url: string, form?: Record<string, string>): Promise<APIResponse> {
    return this.request.post(url, { form });
  }

  protected async put(url: string, form?: Record<string, string>): Promise<APIResponse> {
    return this.request.put(url, { form });
  }

  protected async delete(url: string, form?: Record<string, string>): Promise<APIResponse> {
    return this.request.delete(url, { form });
  }
}
