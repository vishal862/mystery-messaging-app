import { resend } from "../lib/resend";
import VerificationEmail from "../../emails/verifyEmailTemplate";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendEmailVerification(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'Mystery Message | Verification code',
        react: VerificationEmail({username,otp:verifyCode}),
      });
      
    return { success: true, message: "Verification email has been sent" };
  } catch (error) {
    console.log("error occured while sending the verification email", error);
    return { success: false, message: "Failed to send Verification email" };
  }
}
