import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { getCurrentFirebaseUser } from './firebaseAuth';

export interface PeriodLogSectionEntry {
  sectionTitle: string;
  selectedOptions: string[];
  customOptions: string[];
}

export interface CreatePeriodLogInput {
  sections: PeriodLogSectionEntry[];
}

export const createPeriodLog = async ({ sections }: CreatePeriodLogInput): Promise<string> => {
  const firebaseUser = getCurrentFirebaseUser();
  if (!firebaseUser) {
    throw new Error('No authenticated user');
  }

  const cleanedSections = sections
    .map((section) => ({
      sectionTitle: section.sectionTitle,
      selectedOptions: section.selectedOptions
        .map((option) => option.trim())
        .filter(Boolean),
      customOptions: section.customOptions
        .map((option) => option.trim())
        .filter(Boolean),
    }))
    .filter((section) => section.selectedOptions.length > 0 || section.customOptions.length > 0);

  const docRef = await addDoc(collection(db, 'period_logs'), {
    userId: firebaseUser.uid,
    sections: cleanedSections,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return docRef.id;
};
