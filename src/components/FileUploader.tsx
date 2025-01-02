import { GetSasTokenAndUrlResponseDto } from '@/generated/api-client';
import { slugifyFileName } from '@/utils/slugifyFileName';
import React, { useState } from 'react';
import useSWR from 'swr';
import axios from 'axios';
import { useAlert } from '@/components/Alert';
import { useLoading } from '@/hooks/useLoading';

interface FileUploaderProps {
  // This needs to be unique. Make sure to use a unique ID for each instance of the FileUploader component.
  id: string;
  fetchSasTokenData: () => Promise<GetSasTokenAndUrlResponseDto | undefined>;
  onUploadSuccess: (fileUrl: string) => void;
  acceptedFileTypes?: string;
  buttonText?: string;
  disabled?: boolean;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  id,
  fetchSasTokenData,
  onUploadSuccess,
  acceptedFileTypes = 'image/*',
  disabled = false,
}) => {
  const { setAlert } = useAlert();
  const [uploading, setUploading] = useState(false);
  useLoading(uploading);

  const { data: sasTokenData } = useSWR([FileUploader.name, 'sas-token', id], () => fetchSasTokenData());

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!sasTokenData) return;
    const file = event.target.files?.[0];
    if (file) {
      setUploading(true);

      try {
        const uploadUrl = sasTokenData.url; // URL includes the SAS token

        // Create a new file with the slugified name
        const slugifiedName = slugifyFileName(file.name);
        if (!slugifiedName) throw new Error('Error slugifying file name');
        const newFile = new File([file], slugifiedName, { type: file.type });

        await axios.put(`${uploadUrl}/${slugifiedName}?${sasTokenData.sasToken}`, newFile, {
          headers: {
            'x-ms-blob-type': 'BlockBlob',
            'Content-Type': newFile.type,
          },
        });

        const fileUrl = `${uploadUrl}/${slugifiedName}`; // Remove SAS token from URL
        onUploadSuccess(fileUrl);
      } catch (error) {
        setAlert('Error uploading file to Azure Storage', 'error');
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <div>
      <input
        type="file"
        data-testid="file-input"
        accept={acceptedFileTypes}
        onChange={handleFileChange}
        disabled={uploading || disabled}
        style={{ marginTop: '10px' }}
      />
      {uploading && <div>Uploading...</div>}
    </div>
  );
};
