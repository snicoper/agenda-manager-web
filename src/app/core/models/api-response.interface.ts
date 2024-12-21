export interface ApiResponse<TResponse> {
  value: TResponse;
  isSuccess: boolean;
  resultType: number;
}
