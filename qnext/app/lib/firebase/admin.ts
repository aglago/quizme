// app/lib/firebase/admin.ts
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';

// Parse the service account JSON
const serviceAccount = JSON.parse(
  process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string
);

// Initialize Firebase Admin
if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });
}

// Get a reference to storage
export const adminStorage = getStorage().bucket();

// Upload a file
export async function uploadFile(
  userId: string, 
  fileBuffer: Buffer, 
  fileName: string, 
  contentType: string
): Promise<string> {
  const filePath = `documents/${userId}/${Date.now()}-${fileName.replace(/\s+/g, '-')}`;
  const file = adminStorage.file(filePath);
  
  await file.save(fileBuffer, {
    metadata: {
      contentType,
      metadata: {
        userId,
        originalName: fileName
      }
    }
  });
  
  return filePath;
}

// Get a signed URL for temporary access
export async function getSignedUrl(filePath: string): Promise<string> {
  const [url] = await adminStorage.file(filePath).getSignedUrl({
    action: 'read',
    expires: Date.now() + 15 * 60 * 1000, // 15 minutes
  });
  return url;
}

// Delete a file
export async function deleteFile(filePath: string): Promise<void> {
  await adminStorage.file(filePath).delete();
}