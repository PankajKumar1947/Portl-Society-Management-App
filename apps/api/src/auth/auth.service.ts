import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { TokenService } from '../shared/token/token.service';
import { OtpRepository } from './otp.repository';
import { UserService } from '../user/user.service';
import { UserRepository } from '../user/user.repository';
import { UserDocument } from '../user/entities/user.entity';
import { MailService } from '../shared/mail/mail.service';
import {
  RegisterDto,
  LoginDto,
  VerifyOtpDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  ChangePasswordDto,
  ResendOtpDto,
  RefreshTokenDto,
} from './dto/auth.dto';

import { SocietyRepository } from '../society/society.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly otpRepository: OtpRepository,
    private readonly userService: UserService,
    private readonly userRepository: UserRepository,
    private readonly tokenService: TokenService,
    private readonly mailService: MailService,
    private readonly societyRepository: SocietyRepository,
  ) {}

  async register(registerDto: RegisterDto) {
    const { firstName, lastName, email, phone, password } = registerDto;

    const existingUser = await this.userRepository
      .findOne(email)
      .catch(() => null);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const role = 'ADMIN';

    // Create user with default/required fields
    await this.userService.create({
      firstName,
      lastName,
      email,
      phoneNumber: phone,
      role,
      password,
    });

    const otp = this.generateRandomOtp();
    await this.saveOtp(email, otp);

    await this.mailService.sendOtpMail(email, otp);

    return {
      message: 'Registration successful. Verification OTP sent.',
      email,
    };
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto) {
    const { email, otp } = verifyOtpDto;

    const activeOtp = await this.otpRepository.findOne(email);
    if (!activeOtp) {
      throw new BadRequestException(
        'Verification code has expired or is invalid',
      );
    }

    const isMatch = await bcrypt.compare(otp, activeOtp.code);
    if (!isMatch) {
      throw new BadRequestException('Invalid verification code');
    }

    const user = await this.userRepository.findOne(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.emailVerified = true;
    await user.save();

    await this.otpRepository.deleteOne(activeOtp._id.toString());

    return this.generateTokens(user);
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.userRepository.findOne(email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.emailVerified) {
      const otp = this.generateRandomOtp();
      await this.saveOtp(email, otp);
      await this.mailService.sendOtpMail(email, otp);
      throw new UnauthorizedException({
        message: 'Email not verified. Verification OTP sent.',
        emailVerified: false,
        email,
      });
    }

    return this.generateTokens(user);
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;

    const user = await this.userRepository.findOne(email);
    if (!user) {
      throw new NotFoundException('User with this email not found');
    }

    const otp = this.generateRandomOtp();
    await this.saveOtp(email, otp);
    await this.mailService.sendOtpMail(email, otp);

    return {
      message: 'Reset password OTP sent successfully.',
      email,
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { email, otp, password } = resetPasswordDto;

    const activeOtp = await this.otpRepository.findOne(email);
    if (!activeOtp) {
      throw new BadRequestException('Reset code has expired or is invalid');
    }

    const isMatch = await bcrypt.compare(otp, activeOtp.code);
    if (!isMatch) {
      throw new BadRequestException('Invalid reset code');
    }

    const user = await this.userRepository.findOne(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.password = password;
    user.emailVerified = true;
    await user.save();

    await this.otpRepository.deleteOne(activeOtp._id.toString());

    return {
      message:
        'Password reset successful. You can now login with your new password.',
    };
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    const { oldPassword, newPassword } = changePasswordDto;

    const user = await this.userRepository.findOne(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      throw new BadRequestException('Incorrect old password');
    }

    user.password = newPassword;
    await user.save();

    return {
      message: 'Password changed successfully.',
    };
  }

  async resendOtp(resendOtpDto: ResendOtpDto) {
    const { email } = resendOtpDto;

    const user = await this.userRepository.findOne(email);
    if (!user) {
      throw new NotFoundException('User with this email not found');
    }

    if (user.emailVerified) {
      throw new BadRequestException('Email is already verified');
    }

    const otp = this.generateRandomOtp();
    await this.saveOtp(email, otp);
    await this.mailService.sendOtpMail(email, otp);

    return {
      message: 'Verification OTP resent successfully.',
      email,
    };
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    const { refreshToken: token } = refreshTokenDto;

    try {
      const payload = await this.tokenService.verifyToken(token);
      const user = await this.userRepository.findOne(payload.userId);

      if (!user) {
        throw new UnauthorizedException('User no longer exists');
      }

      const { accessToken, refreshToken: newRefreshToken } =
        await this.tokenService.generateTokens({
          userId: user.userId,
          email: user.email,
          role: user.role,
        });

      return {
        message: 'Tokens refreshed successfully',
        accessToken,
        refreshToken: newRefreshToken,
      };
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  private generateRandomOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private async saveOtp(email: string, otp: string) {
    const salt = await bcrypt.genSalt(10);
    const hashedOtp = await bcrypt.hash(otp, salt);
    await this.otpRepository.saveOtp(
      email,
      hashedOtp,
      new Date(Date.now() + 5 * 60 * 1000),
    );
  }

  private async generateTokens(user: UserDocument) {
    const payload = { userId: user.userId, email: user.email, role: user.role };
    const { accessToken, refreshToken } =
      await this.tokenService.generateTokens(payload);

    const existingSociety = await this.societyRepository.findByUserId(
      user.userId,
    );

    return {
      message: 'Authentication successful',
      accessToken,
      refreshToken,
      isSocietyCreated: !!existingSociety,
      name: `${user.firstName} ${user.lastName}`.trim(),
    };
  }
}
