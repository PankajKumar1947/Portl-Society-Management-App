import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { getSendOtpTemplate } from './templates/send-otp.template';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter?: nodemailer.Transporter;
  private readonly fromAddress: string;

  constructor() {
    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT
      ? parseInt(process.env.SMTP_PORT, 10)
      : 587;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    this.fromAddress = process.env.SMTP_FROM!;

    if (host && user && pass) {
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: {
          user,
          pass,
        },
      });
      this.logger.log(`Nodemailer transporter initialized for host: ${host}`);
    } else {
      this.logger.warn(
        'SMTP configurations (SMTP_HOST, SMTP_USER, SMTP_PASS) are missing. MailService will run in MOCK mode (logging to console).',
      );
    }
  }

  async sendMail(to: string, subject: string, html: string): Promise<void> {
    if (this.transporter) {
      try {
        await this.transporter.sendMail({
          from: this.fromAddress,
          to,
          subject,
          html,
        });
        this.logger.log(`Email successfully sent to ${to}`);
      } catch (error: unknown) {
        this.logger.error(
          `Failed to send email to ${to}:`,
          error instanceof Error ? error.message : String(error),
        );
        throw error;
      }
    } else {
      const cleanBody = html
        .replace(/<style[\s\S]*?<\/style>/gi, '')
        .replace(/<[^>]*>/g, '')
        .replace(/\n\s*\n/g, '\n')
        .trim();
      this.logger.log(
        `[MOCK EMAIL]\nTo: ${to}\nSubject: ${subject}\nBody:\n${cleanBody}`,
      );
    }
  }

  async sendOtpMail(to: string, otp: string): Promise<void> {
    const subject = 'Your Portl Verification OTP';
    const html = getSendOtpTemplate(otp);
    await this.sendMail(to, subject, html);
  }
}
