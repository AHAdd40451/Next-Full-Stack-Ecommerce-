import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';
import { serviceAccount } from '@/app/(backend)/lib/firebase-private-key';

// Check if Firebase app is already initialized
const app = !getApps().length 
    ? initializeApp({
        credential: cert(serviceAccount),
        storageBucket: `${serviceAccount.project_id}.appspot.com`
      })
    : getApps()[0];

export const bucket = getStorage(app).bucket();