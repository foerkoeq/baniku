// start of frontend/types/activity.ts
export type ActivityType = 
  | 'NEW_MEMBER'
  | 'UPDATE_MEMBER'
  | 'NEW_FAMILY'
  | 'NEW_EVENT'
  | 'UPDATE_EVENT'
  | 'NEW_PHOTO'
  | 'UPDATE_STORY';

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description?: string;
  baniId?: string;
  baniName?: string;
  createdAt: Date;
  metadata?: Record<string, any>;
}
// end of frontend/types/activity.ts