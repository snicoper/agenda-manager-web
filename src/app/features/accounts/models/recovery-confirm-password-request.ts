export interface RecoveryConfirmPasswordRequest {
  token: string;
  newPassword: string;
  confirmNewPassword: string;
}
