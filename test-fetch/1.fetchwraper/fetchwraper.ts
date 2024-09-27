// fetch-wrapper.ts

import { AbortController } from 'abort-controller';

export class FetchWrapper {
  private abortController?: AbortController;

  private async fetchWithTimeout(
    url: string,
    options: RequestInit,
    timeout: number
  ): Promise<Response> {
    this.abortController = new AbortController();
    const signal = this.abortController.signal;

    const fetchPromise = fetch(url, { ...options, signal });
    const timeoutPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        this.abortController.abort();
        reject(new Error('Request timed out'));
      }, timeout);
    });

    try {
      return (await Promise.race([fetchPromise, timeoutPromise])) as Response;
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Request aborted due to timeout');
      }
      throw error;
    }
  }

  public async get(
    url: string,
    config: { headers?: HeadersInit; timeout?: number } = {}
  ): Promise<Response> {
    return this.fetchWithTimeout(
      url,
      { method: 'GET', ...config },
      config.timeout ?? 8000
    );
  }

  public async post(
    url: string,
    body: BodyInit,
    config: { headers?: HeadersInit; timeout?: number } = {}
  ): Promise<Response> {
    return this.fetchWithTimeout(
      url,
      { method: 'POST', body, ...config },
      config.timeout ?? 8000
    );
  }

  public async put(
    url: string,
    body: BodyInit,
    config: { headers?: HeadersInit; timeout?: number } = {}
  ): Promise<Response> {
    return this.fetchWithTimeout(
      url,
      { method: 'PUT', body, ...config },
      config.timeout ?? 8000
    );
  }

  public async delete(
    url: string,
    config: { headers?: HeadersInit; timeout?: number } = {}
  ): Promise<Response> {
    return this.fetchWithTimeout(
      url,
      { method: 'DELETE', ...config },
      config.timeout ?? 8000
    );
  }

  public cancelRequest() {
    if (this.abortController) {
      this.abortController.abort();
    }
  }
}
