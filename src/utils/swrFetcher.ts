/**
 * Fetches data from the given URL and returns the JSON response.
 * @returns {Promise<any>} - A promise that resolves to the JSON response.
 */
export const swrFetcher = (url: string) => fetch(url).then((res) => res.json());
