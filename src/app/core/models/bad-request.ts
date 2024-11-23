export interface BadRequest {
  detail: string;
  status: number;
  title: string;
  type: string;
  errors: Record<string, string[]>;
}
