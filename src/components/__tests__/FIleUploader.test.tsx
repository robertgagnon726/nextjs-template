import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import axios from 'axios';
import useSWR from 'swr';
import { useAlert } from '@/components/Alert';
import { useLoading } from '@/hooks/useLoading';
import { slugifyFileName } from '@/utils/slugifyFileName';
import { FileUploader } from '@Components/FileUploader';

vi.mock('axios');
vi.mock('swr');
vi.mock('@/components/Alert');
vi.mock('@/hooks/useLoading');
vi.mock('@/utils/slugifyFileName');

describe('FileUploader', () => {
  const mockFetchSasTokenData = vi.fn();
  const mockOnUploadSuccess = vi.fn();
  const mockSetAlert = vi.fn();

  beforeEach(() => {
    vi.mocked(useSWR).mockReturnValue({
      data: { url: 'https://example.blob.core.windows.net', sasToken: 'sas-token' },
    } as any);
    vi.mocked(useAlert).mockReturnValue({ setAlert: mockSetAlert });
    vi.mocked(useLoading).mockImplementation(() => {});
    vi.mocked(slugifyFileName).mockImplementation((name) => `slugified-${name}`);
    vi.clearAllMocks();
  });

  const renderComponent = (props = {}) =>
    render(
      <FileUploader
        id="test-uploader"
        fetchSasTokenData={mockFetchSasTokenData}
        onUploadSuccess={mockOnUploadSuccess}
        {...props}
      />,
    );

  it('should render the file input', () => {
    renderComponent();

    expect(screen.getByTestId('file-input')).toBeInTheDocument();
  });

  it('should handle file upload successfully', async () => {
    const file = new File(['file content'], 'test.png', { type: 'image/png' });
    vi.mocked(axios.put).mockResolvedValueOnce({});

    renderComponent();

    const input = screen.getByTestId('file-input');
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(slugifyFileName).toHaveBeenCalledWith('test.png');
      expect(axios.put).toHaveBeenCalledWith(
        'https://example.blob.core.windows.net/slugified-test.png?sas-token',
        expect.any(File),
        {
          headers: {
            'x-ms-blob-type': 'BlockBlob',
            'Content-Type': 'image/png',
          },
        },
      );
      expect(mockOnUploadSuccess).toHaveBeenCalledWith('https://example.blob.core.windows.net/slugified-test.png');
    });
  });

  it('should handle errors during file upload', async () => {
    const file = new File(['file content'], 'test.png', { type: 'image/png' });
    vi.mocked(axios.put).mockRejectedValueOnce(new Error('Upload failed'));

    renderComponent();

    const input = screen.getByTestId('file-input');
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(mockSetAlert).toHaveBeenCalledWith('Error uploading file to Azure Storage', 'error');
      expect(mockOnUploadSuccess).not.toHaveBeenCalled();
    });
  });

  it('should show "Uploading..." while uploading', async () => {
    const file = new File(['file content'], 'test.png', { type: 'image/png' });
    vi.mocked(axios.put).mockResolvedValueOnce({});

    renderComponent();

    const input = screen.getByTestId('file-input');
    fireEvent.change(input, { target: { files: [file] } });

    expect(screen.getByText('Uploading...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText('Uploading...')).not.toBeInTheDocument();
    });
  });

  it('should disable the input during upload', async () => {
    const file = new File(['file content'], 'test.png', { type: 'image/png' });
    vi.mocked(axios.put).mockResolvedValueOnce({});

    renderComponent();

    const input = screen.getByTestId('file-input');
    fireEvent.change(input, { target: { files: [file] } });

    expect(input).toBeDisabled();

    await waitFor(() => {
      expect(input).not.toBeDisabled();
    });
  });

  it('should disable the input if the component is disabled', () => {
    renderComponent({ disabled: true });

    const input = screen.getByTestId('file-input');
    expect(input).toBeDisabled();
  });
});
