import { IScheduleRepository, WeeklySchedule, LocationType, DailyStatus } from '../types';
import { formatDateKey } from '../utils/dateUtils';

// Mock Data Store
let MOCK_DB: WeeklySchedule[] = [
  {
    userId: 'user_1',
    userDisplayName: 'ישראל ישראלי',
    userPhotoURL: 'https://picsum.photos/40/40?random=1',
    days: {
      // Intentionally leaving some empty to test defaults
      '2024-05-19': { dateStr: '2024-05-19', location: LocationType.OFFICE, updatedAt: Date.now() },
      '2024-05-20': { dateStr: '2024-05-20', location: LocationType.HOME, updatedAt: Date.now() },
    }
  },
  {
    userId: 'user_2',
    userDisplayName: 'דנה כהן',
    userPhotoURL: 'https://picsum.photos/40/40?random=2',
    days: {}
  },
  {
    userId: 'user_3',
    userDisplayName: 'משה לוי',
    userPhotoURL: 'https://picsum.photos/40/40?random=3',
    days: {}
  }
];

// Helper to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class MockScheduleRepository implements IScheduleRepository {
  
  async getUserSchedule(userId: string, weekStart: Date): Promise<WeeklySchedule> {
    await delay(300); // Simulate network
    const schedule = MOCK_DB.find(s => s.userId === userId);
    
    if (!schedule) {
      // Create fresh if not exists in mock DB
      return {
        userId,
        userDisplayName: 'משתמש חדש',
        days: {}
      };
    }
    return JSON.parse(JSON.stringify(schedule)); // Deep copy to prevent ref issues
  }

  async updateDailyStatus(userId: string, userDisplayName: string, userPhotoURL: string | undefined, date: Date, location: LocationType): Promise<void> {
    await delay(200);
    const dateKey = formatDateKey(date);
    
    let userSchedule = MOCK_DB.find(s => s.userId === userId);
    
    if (!userSchedule) {
        userSchedule = {
            userId,
            userDisplayName,
            userPhotoURL,
            days: {}
        };
        MOCK_DB.push(userSchedule);
    }

    // Update user info if changed
    userSchedule.userDisplayName = userDisplayName;
    if(userPhotoURL) userSchedule.userPhotoURL = userPhotoURL;

    // Update status
    userSchedule.days[dateKey] = {
      dateStr: dateKey,
      location,
      updatedAt: Date.now()
    };
    
    console.log(`[MockDB] Updated ${userDisplayName} on ${dateKey} to ${location}`);
  }

  async getTeamSchedules(weekStart: Date): Promise<WeeklySchedule[]> {
    await delay(500); // Simulate heavier query
    // In a real DB we would query where 'date' >= weekStart AND 'date' <= weekEnd
    // For Mock, we just return the whole DB as the client filters/maps it.
    return JSON.parse(JSON.stringify(MOCK_DB));
  }
}