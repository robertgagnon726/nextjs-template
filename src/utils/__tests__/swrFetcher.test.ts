import { swrFetcher } from '@Utils/swrFetcher';
import { vi, describe, it, expect, afterEach, Mock } from 'vitest';

global.fetch = vi.fn();

describe('swrFetcher', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch data and return JSON response', async () => {
    const mockResponse = { data: 'test data' };
    (global.fetch as Mock).mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(mockResponse),
    });

    const url = 'https://api.example.com/data';
    const result = await swrFetcher(url);

    expect(fetch).toHaveBeenCalledWith(url);
    expect(result).toEqual(mockResponse);
  });

  it('should throw an error if fetch fails', async () => {
    (global.fetch as Mock).mockRejectedValue(new Error('Fetch error'));

    const url = 'https://api.example.com/data';

    await expect(swrFetcher(url)).rejects.toThrow('Fetch error');
    expect(fetch).toHaveBeenCalledWith(url);
  });

  it('should throw an error if response is not JSON', async () => {
    (global.fetch as Mock).mockResolvedValue({
      ok: true,
      json: vi.fn().mockRejectedValue(new Error('Invalid JSON')),
    });

    const url = 'https://api.example.com/data';

    await expect(swrFetcher(url)).rejects.toThrow('Invalid JSON');
    expect(fetch).toHaveBeenCalledWith(url);
  });
});
