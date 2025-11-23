import { LocationType } from './types';

export const APP_NAME = "HybridFlow";

export const WEEK_DAYS_HEBREW = [
  'יום ראשון',
  'יום שני',
  'יום שלישי',
  'יום רביעי',
  'יום חמישי'
];

export const LOCATION_LABELS: Record<LocationType, string> = {
  [LocationType.OFFICE]: 'במשרד',
  [LocationType.HOME]: 'מהבית',
  [LocationType.ABSENT]: 'היעדרות',
  [LocationType.NOT_SET]: 'טרם נקבע'
};

export const LOCATION_COLORS: Record<LocationType, string> = {
  [LocationType.OFFICE]: 'bg-green-100 text-green-800 border-green-200',
  [LocationType.HOME]: 'bg-blue-100 text-blue-800 border-blue-200',
  [LocationType.ABSENT]: 'bg-red-100 text-red-800 border-red-200',
  [LocationType.NOT_SET]: 'bg-gray-100 text-gray-500 border-gray-200 border-dashed'
};

export const LOCATION_ICONS: Record<LocationType, string> = {
  [LocationType.OFFICE]: '🏢',
  [LocationType.HOME]: '🏠',
  [LocationType.ABSENT]: '🏖️',
  [LocationType.NOT_SET]: '❓'
};