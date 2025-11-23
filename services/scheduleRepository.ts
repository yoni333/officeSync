import { IScheduleRepository } from '../types';
import { MockScheduleRepository } from './mockScheduleRepository';

// In a real app, we would switch this based on an environment variable.
// e.g. const useRealDb = process.env.REACT_APP_USE_FIREBASE === 'true';

export const scheduleRepository: IScheduleRepository = new MockScheduleRepository();

// Future Firebase Implementation Skeleton:
/*
import { db } from '../firebaseConfig'; // user needs to create this
import { collection, query, where, getDocs, doc, setDoc } from 'firebase/firestore';

class FirebaseScheduleRepository implements IScheduleRepository {
    // Implement methods using Firestore SDK
}
*/