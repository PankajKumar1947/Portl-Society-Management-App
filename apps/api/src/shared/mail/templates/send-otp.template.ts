import { getBaseEmailTemplate } from './base-email.template';

export function getSendOtpTemplate(otp: string): string {
  const content = `
    <h2 style="color: #252833; margin-top: 0; font-size: 20px;">Welcome to Portl!</h2>
    <p style="color: #5E6573; font-size: 16px; margin-bottom: 24px;">Please use the following verification code to complete your request:</p>
    <div style="background-color: #F5F4EF; padding: 20px; text-align: center; font-size: 28px; font-weight: bold; letter-spacing: 6px; border-radius: 6px; border: 1px dashed #ECE8DD; margin: 24px 0; color: #252833;">
      ${otp}
    </div>
    <p style="color: #5E6573; font-size: 14px; line-height: 1.5;">This verification code is valid for 5 minutes. If you did not request this, you can safely ignore this email.</p>
  `;
  return getBaseEmailTemplate('Verification Code', content);
}
