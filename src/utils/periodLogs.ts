import {
  addDoc,
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from './firebase';
import { getCurrentFirebaseUser } from './firebaseAuth';

function startEndOfLocalDay(d: Date): { start: Date; end: Date } {
  const start = new Date(d);
  start.setHours(0, 0, 0, 0);
  const end = new Date(d);
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

function toMillis(value: unknown): number | null {
  if (
    value &&
    typeof value === 'object' &&
    'toMillis' in value &&
    typeof (value as { toMillis: () => number }).toMillis === 'function'
  ) {
    return (value as { toMillis: () => number }).toMillis();
  }
  if (value instanceof Date) {
    return value.getTime();
  }
  return null;
}

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

export interface TodayPeriodLog {
  id: string;
  sections: PeriodLogSectionEntry[];
}

/** Latest period_logs doc for this user whose createdAt falls on the local calendar day of `day`. */
export const getLatestPeriodLogForLocalDay = async (
  day: Date = new Date()
): Promise<TodayPeriodLog | null> => {
  const firebaseUser = getCurrentFirebaseUser();
  if (!firebaseUser) {
    return null;
  }

  const { start, end } = startEndOfLocalDay(day);
  const startMs = start.getTime();
  const endMs = end.getTime();

  const q = query(
    collection(db, 'period_logs'),
    where('userId', '==', firebaseUser.uid),
    orderBy('createdAt', 'desc'),
    limit(25)
  );

  const snap = await getDocs(q);
  for (const d of snap.docs) {
    const data = d.data() as {
      createdAt?: unknown;
      sections?: PeriodLogSectionEntry[];
    };
    const ms = toMillis(data.createdAt);
    if (ms == null) {
      continue;
    }
    if (ms >= startMs && ms <= endMs && Array.isArray(data.sections)) {
      return { id: d.id, sections: data.sections };
    }
  }

  return null;
};

export const updatePeriodLog = async (
  logId: string,
  { sections }: CreatePeriodLogInput
): Promise<void> => {
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

  await updateDoc(doc(db, 'period_logs', logId), {
    sections: cleanedSections,
    updatedAt: serverTimestamp(),
  });
};
