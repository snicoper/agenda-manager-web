export interface ConfirmAccountRequest {
  token: string;
  newPassword: string;
  confirmNewPassword: string;
}
