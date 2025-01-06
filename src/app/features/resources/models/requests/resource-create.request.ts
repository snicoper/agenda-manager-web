export interface ResourceCreateRequest {
  resourceTypeId: string;
  userId?: string;
  name: string;
  description: string;
  textColor: string;
  backgroundColor: string;
}
