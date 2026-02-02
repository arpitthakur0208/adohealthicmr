/** OTP is handled in-memory in auth routes (no MongoDB). */
export interface IOTP {
  email: string;
  otp: string;
  expiresAt: Date;
}
