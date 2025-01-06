import { DateTime } from 'luxon';

export interface ResourcePaginatedResponse {
  resourceId: string;
  name: string;
  description: string;
  textColor: string;
  backgroundColor: string;
  isActive: boolean;
  deactivationReason?: string;
  createdAt: DateTime;
}
