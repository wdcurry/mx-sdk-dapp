import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

async function customPost<T = any, R = AxiosResponse<T, any>, D = any>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig<D> | undefined
): Promise<R> {
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      headers: {
        'Content-Type': 'application/json',
        ...(config?.headers || {})
      },
      ...config
    } as RequestInit);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Clone the response to be able to read it twice (for status and data)
    const clonedResponse = response.clone();

    // Parse the JSON body asynchronously
    const jsonPromise = clonedResponse.json();

    // Return the standardized response object
    return Promise.all([jsonPromise]).then(([responseData]) => ({
      data: responseData,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      config
    })) as Promise<R>;
  } catch (error) {
    console.error('Fetch Error:', error);
    throw error;
  }
}

async function customGet<T = any, R = AxiosResponse<T, any>, D = any>(
  url: string,
  config?: AxiosRequestConfig<D> | undefined
): Promise<R> {
  try {
    const response = await fetch(url, config as RequestInit);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Clone the response to be able to read it twice (for status and data)
    const clonedResponse = response.clone();

    // Parse the JSON body asynchronously
    const jsonPromise = clonedResponse.json();

    // Return the standardized response object
    return Promise.all([jsonPromise]).then(([data]) => ({
      data,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      config
    })) as Promise<R>;
  } catch (error) {
    console.error('Fetch Error:', error);
    throw error;
  }
}

const axiosInstance = axios.create();
axiosInstance.get = customGet;
axiosInstance.post = customPost;

export { axiosInstance };
