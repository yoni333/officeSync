import React, { useEffect, useState } from 'react';
import { User, LocationType, WeeklySchedule } from '../types';
import { scheduleRepository } from '../services/scheduleRepository';
import { getStartOfWeek, getWorkWeekDays, formatDateKey, formatDateDisplay } from '../utils/dateUtils';
import { WEEK_DAYS_HEBREW } from '../constants';
import { StatusBadge } from './StatusBadge';
import { LoadingSpinner } from './LoadingSpinner';

interface MyScheduleProps {
  user: User;
}

export const MySchedule: React.FC<MyScheduleProps> = ({ user }) => {
  const [loading, setLoading] = useState(true);
  const [currentWeekStart, setCurrentWeekStart] = useState(getStartOfWeek());
  const [scheduleData, setScheduleData] = useState<WeeklySchedule | null>(null);
  const [savingDate, setSavingDate] = useState<string | null>(null);

  useEffect(() => {
    fetchSchedule();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentWeekStart, user.uid]);

  const fetchSchedule = async () => {
    setLoading(true);
    try {
      const data = await scheduleRepository.getUserSchedule(user.uid, currentWeekStart);
      setScheduleData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (date: Date, newStatus: LocationType) => {
    const dateKey = formatDateKey(date);
    setSavingDate(dateKey);
    
    // Optimistic Update
    setScheduleData(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        days: {
          ...prev.days,
          [dateKey]: { dateStr: dateKey, location: newStatus, updatedAt: Date.now() }
        }
      };
    });

    try {
      await scheduleRepository.updateDailyStatus(
        user.uid, 
        user.displayName, 
        user.photoURL, 
        date, 
        newStatus
      );
    } catch (err) {
      console.error("Failed to save", err);
      // Revert would happen here in a real robust app
      alert("שגיאה בשמירה, אנא נסה שנית");
    } finally {
      setSavingDate(null);
    }
  };

  const workDays = getWorkWeekDays(currentWeekStart);

  if (loading && !scheduleData) return <LoadingSpinner />;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">הלו"ז שלי לשבוע הקרוב</h2>
          <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200">
             שבוע של ה-{formatDateDisplay(currentWeekStart)}
          </span>
        </div>
        
        <div className="divide-y divide-gray-100">
          {workDays.map((date, index) => {
            const dateKey = formatDateKey(date);
            const currentStatus = scheduleData?.days[dateKey]?.location || LocationType.NOT_SET;
            const isSaving = savingDate === dateKey;

            return (
              <div key={dateKey} className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-center justify-center bg-blue-50 text-blue-800 rounded-lg w-16 h-16 shrink-0">
                    <span className="text-xs font-semibold">{WEEK_DAYS_HEBREW[index]}</span>
                    <span className="text-xl font-bold">{formatDateDisplay(date)}</span>
                  </div>
                  <div>
                    <p className="text-gray-900 font-medium hidden sm:block">סטטוס נוכחות</p>
                    <p className="text-sm text-gray-500 sm:hidden">בחר סטטוס:</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 items-center">
                  {[LocationType.OFFICE, LocationType.HOME, LocationType.ABSENT].map((type) => {
                    const isActive = currentStatus === type;
                    return (
                      <button
                        key={type}
                        onClick={() => handleStatusChange(date, type as LocationType)}
                        disabled={isSaving}
                        className={`
                          relative overflow-hidden transition-all duration-200 rounded-lg px-4 py-2 text-sm font-medium border
                          ${isActive 
                            ? 'ring-2 ring-primary ring-offset-1 z-10 scale-105 ' 
                            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                          }
                          ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}
                        `}
                      >
                         {/* Passively renders the badge inside logic */}
                         <div className={`${isActive ? '' : 'opacity-70'}`}>
                             <StatusBadge status={type as LocationType} />
                         </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};