// fetch-wrapper.ts

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
        this.abortController?.abort();
        reject(new Error('Request timed out'));
      }, timeout);
    });

    try {
      return (await Promise.race([fetchPromise, timeoutPromise])) as Response;
    } catch (error: unknown) {
      const errorAsError = error as Error;
      if (errorAsError.name === 'AbortError') {
        throw new Error('Request aborted due to timeout');
      }
      throw error;
    }
  }

  public async pollRequest(
    url: string,
    pollInterval: number,
    checkCondition: (response: Response) => boolean,
    config: { headers?: HeadersInit; timeout?: number } = {},
    shouldPoll: boolean = true
  ): Promise<Response> {
    if (!shouldPoll) {
      try {
        return await this.fetchWithTimeout(
          url,
          { method: 'GET', ...config },
          config.timeout ?? 8000
        );
      } catch (error) {
        throw error;
      }
    }

    return new Promise((resolve, reject) => {
      const executePolling = async () => {
        try {
          const response = await this.fetchWithTimeout(
            url,
            { method: 'GET', ...config },
            config.timeout ?? 8000
          );
          if (checkCondition(response)) {
            resolve(response);
          } else {
            setTimeout(executePolling, pollInterval);
          }
        } catch (error) {
          console.error('Polling request failed:', error.message);
          setTimeout(executePolling, pollInterval);
        }
      };

      executePolling();
    });
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
