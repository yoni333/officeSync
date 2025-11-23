// Enums
export enum LocationType {
  OFFICE = 'OFFICE',
  HOME = 'HOME',
  ABSENT = 'ABSENT',
  NOT_SET = 'NOT_SET'
}

// Interfaces
export interface User {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
}

export interface DailyStatus {
  dateStr: string; // ISO Date String YYYY-MM-DD
  location: LocationType;
  updatedAt: number;
}

export interface WeeklySchedule {
  userId: string;
  userDisplayName: string;
  userPhotoURL?: string;
  days: Record<string, DailyStatus>; // Key is YYYY-MM-DD
}

// Service Interface (Repository Pattern)
export interface IScheduleRepository {
  /**
   * Get the schedule for a specific user for a specific week range
   */
  getUserSchedule(userId: string, weekStart: Date): Promise<WeeklySchedule>;

  /**
   * Update a specific day's status for the current user
   */
  updateDailyStatus(userId: string, userDisplayName: string, userPhotoURL: string | undefined, date: Date, location: LocationType): Promise<void>;

  /**
   * Get all schedules for the entire team for a specific week
   */
  getTeamSchedules(weekStart: Date): Promise<WeeklySchedule[]>;
}

export interface IAuthService {
  currentUser: User | null;
  login(): Promise<User>;
  logout(): Promise<void>;
  onAuthStateChanged(callback: (user: User | null) => void): () => void;
}