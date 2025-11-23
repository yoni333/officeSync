import React, { useEffect, useState } from 'react';
import { WeeklySchedule, LocationType } from '../types';
import { scheduleRepository } from '../services/scheduleRepository';
import { getStartOfWeek, getWorkWeekDays, addWeeks, formatDateKey, formatDateDisplay, isSameDay } from '../utils/dateUtils';
import { WEEK_DAYS_HEBREW } from '../constants';
import { StatusBadge } from './StatusBadge';
import { LoadingSpinner } from './LoadingSpinner';

export const TeamRoster: React.FC = () => {
  const [viewDate, setViewDate] = useState(getStartOfWeek());
  const [schedules, setSchedules] = useState<WeeklySchedule[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTeamData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewDate]);

  const fetchTeamData = async () => {
    setLoading(true);
    try {
      const data = await scheduleRepository.getTeamSchedules(viewDate);
      setSchedules(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevWeek = () => setViewDate(prev => addWeeks(prev, -1));
  const handleNextWeek = () => setViewDate(prev => addWeeks(prev, 1));
  const handleCurrentWeek = () => setViewDate(getStartOfWeek());

  const workDays = getWorkWeekDays(viewDate);
  const isCurrentWeek = isSameDay(viewDate, getStartOfWeek());

  return (
    <div className="space-y-6">
      {/* Date Navigation */}
      <div className="flex flex-col sm:flex-row items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100 gap-4">
        <div className="flex items-center gap-2">
           <button 
             onClick={handlePrevWeek}
             className="p-2 hover:bg-gray-100 rounded-full transition-colors"
             aria-label="שבוע שעבר"
           >
             <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
           </button>
           
           <div className="text-center min-w-[150px]">
             <span className="block text-lg font-bold text-gray-800">
               {formatDateDisplay(viewDate)} - {formatDateDisplay(workDays[4])}
             </span>
           </div>

           <button 
             onClick={handleNextWeek}
             className="p-2 hover:bg-gray-100 rounded-full transition-colors"
             aria-label="שבוע הבא"
           >
             <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
           </button>
        </div>

        {!isCurrentWeek && (
            <button 
                onClick={handleCurrentWeek}
                className="text-sm text-primary hover:underline font-medium"
            >
                חזור לשבוע הנוכחי
            </button>
        )}
      </div>

      {/* Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
        {loading ? (
            <LoadingSpinner />
        ) : (
            <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>
                <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider sticky right-0 bg-gray-50 z-10 w-48 shadow-lg sm:shadow-none">
                    עובד
                </th>
                {workDays.map((day, idx) => (
                    <th key={idx} scope="col" className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                        <div className="flex flex-col items-center">
                            <span className="font-bold">{WEEK_DAYS_HEBREW[idx]}</span>
                            <span className="text-gray-400 font-normal">{formatDateDisplay(day)}</span>
                        </div>
                    </th>
                ))}
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {schedules.length === 0 && (
                    <tr>
                        <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                            לא נמצאו נתונים לשבוע זה
                        </td>
                    </tr>
                )}
                {schedules.map((schedule) => (
                <tr key={schedule.userId} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap sticky right-0 bg-white z-10 border-l border-gray-100">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                            {schedule.userPhotoURL ? (
                                <img className="h-10 w-10 rounded-full" src={schedule.userPhotoURL} alt="" />
                            ) : (
                                <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                                    {schedule.userDisplayName.charAt(0)}
                                </div>
                            )}
                            </div>
                            <div className="mr-4">
                            <div className="text-sm font-medium text-gray-900">{schedule.userDisplayName}</div>
                            </div>
                        </div>
                    </td>
                    {workDays.map((day) => {
                        const dateKey = formatDateKey(day);
                        const dayStatus = schedule.days[dateKey];
                        const location = dayStatus ? dayStatus.location : LocationType.NOT_SET;

                        return (
                            <td key={dateKey} className="px-6 py-4 whitespace-nowrap text-center">
                                <StatusBadge status={location} />
                            </td>
                        );
                    })}
                </tr>
                ))}
            </tbody>
            </table>
        )}
      </div>
    </div>
  );
};