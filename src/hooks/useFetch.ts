const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

interface FetchOptions {
  headers?: Record<string, string>;
}

const useFetch = (baseUrl: string = API_BASE_URL, options: FetchOptions = {}) => {
  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const get = async <T>(endpoint: string): Promise<T> => {
    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: 'GET',
      headers: defaultHeaders,
    });
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    return response.json() as Promise<T>;
  };

  const post = async <T>(endpoint: string, body: unknown): Promise<T> => {
    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: 'POST',
      headers: defaultHeaders,
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    return response.json() as Promise<T>;
  };

  const put = async <T>(endpoint: string, body: unknown): Promise<T> => {
    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: 'PUT',
      headers: defaultHeaders,
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    return response.json() as Promise<T>;
  };

  const del = async <T>(endpoint: string): Promise<T> => {
    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: 'DELETE',
      headers: defaultHeaders,
    });
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    return response.json() as Promise<T>;
  };

  return { get, post, put, del };
};

export default useFetch;
