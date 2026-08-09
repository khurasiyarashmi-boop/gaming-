export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  createdTime?: string;
  modifiedTime?: string;
  webViewLink?: string;
  iconLink?: string;
  thumbnailLink?: string;
  parents?: string[];
}

export const fetchDriveFiles = async (accessToken: string, query?: string): Promise<DriveFile[]> => {
  const params = new URLSearchParams({
    pageSize: '50',
    fields: 'files(id, name, mimeType, size, createdTime, modifiedTime, webViewLink, iconLink, thumbnailLink)',
    orderBy: 'modifiedTime desc',
  });

  if (query) {
    params.append('q', query);
  }

  const res = await fetch(`https://www.googleapis.com/drive/v3/files?${params.toString()}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error?.message || `Drive API error: ${res.statusText}`);
  }

  const data = await res.json();
  return data.files || [];
};

export const createDriveFolder = async (accessToken: string, folderName: string): Promise<DriveFile> => {
  const metadata = {
    name: folderName,
    mimeType: 'application/vnd.google-apps.folder',
  };

  const res = await fetch('https://www.googleapis.com/drive/v3/files', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(metadata),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error?.message || 'Failed to create Google Drive folder');
  }

  return res.json();
};

export const uploadJsonToDrive = async (
  accessToken: string,
  fileName: string,
  jsonData: any,
  folderId?: string,
  description?: string
): Promise<DriveFile> => {
  const metadata: any = {
    name: fileName,
    mimeType: 'application/json',
    description: description || 'ALL JAIHO COMPANY App Backup',
  };

  if (folderId) {
    metadata.parents = [folderId];
  }

  const jsonString = JSON.stringify(jsonData, null, 2);
  const boundary = 'foo_bar_baz_boundary';

  let body = `--${boundary}\r\n`;
  body += 'Content-Type: application/json; charset=UTF-8\r\n\r\n';
  body += JSON.stringify(metadata) + '\r\n';
  body += `--${boundary}\r\n`;
  body += 'Content-Type: application/json\r\n\r\n';
  body += jsonString + '\r\n';
  body += `--${boundary}--`;

  const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,size,createdTime,modifiedTime,webViewLink', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': `multipart/related; boundary=${boundary}`,
    },
    body,
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error?.message || 'Failed to upload backup to Google Drive');
  }

  return res.json();
};

export const readDriveFileContent = async (accessToken: string, fileId: string): Promise<any> => {
  const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    throw new Error(`Failed to download file from Google Drive (${res.statusText})`);
  }

  return res.json();
};

export const deleteDriveFile = async (accessToken: string, fileId: string): Promise<boolean> => {
  const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok && res.status !== 204) {
    throw new Error(`Failed to delete file from Google Drive (${res.statusText})`);
  }

  return true;
};
