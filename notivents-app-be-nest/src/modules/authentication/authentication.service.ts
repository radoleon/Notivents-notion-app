import { Injectable } from '@nestjs/common'
import { ConfirmResponseDto } from 'src/dtos/authentication/ConfirmResponseDto'
import { OtpRequestDto } from 'src/dtos/authentication/OtpRequestDto'
import { PwdRequestDto } from 'src/dtos/authentication/PwdRequestDto'
import { SignupResponseDto } from 'src/dtos/authentication/SignupResponseDto'
import { UserProfileDto } from 'src/dtos/authentication/UserProfileDto'
import { MailService } from '../mail/mail.service'
import { AuthenticationRepository } from './authentication.repository'

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly _authenticationRepository: AuthenticationRepository,
    private readonly _mailService: MailService
  ) {}

  public async confirm(request: PwdRequestDto): Promise<ConfirmResponseDto> {
    const userId = await this._authenticationRepository.getUserIdFromRequest(request.email)

    if (userId) {
      const isUnconfirmed = await this._authenticationRepository.isUserUnconfirmed(userId)

      if (isUnconfirmed) {
        const confirmationLink = await this._authenticationRepository.generateSignupLink(
          request.email,
          request.password
        )

        const encodedConfirmationLink = encodeURIComponent(confirmationLink)

        const redirectLink = `http://localhost:5173/confirm?type=signup&confirmation_link=${encodedConfirmationLink}`

        await this._mailService.sendSignupLink(request.email, redirectLink)

        return { is_unconfirmed: true }
      }
    }

    return { is_unconfirmed: false }
  }

  public async signup(request: PwdRequestDto): Promise<SignupResponseDto> {
    const userId = await this._authenticationRepository.getUserIdFromRequest(request.email)

    if (userId) {
      const isUserOtp = await this._authenticationRepository.isUserOtp(userId)

      if (isUserOtp) {
        return { is_user_otp: true }
      }
    }

    await this._authenticationRepository.createUserPwd(request.email, request.password)

    const confirmationLink = await this._authenticationRepository.generateSignupLink(request.email, request.password)

    const encodedConfirmationLink = encodeURIComponent(confirmationLink)

    const redirectLink = `http://localhost:5173/confirm?type=signup&confirmation_link=${encodedConfirmationLink}`

    await this._mailService.sendSignupLink(request.email, redirectLink)

    return { is_user_otp: false }
  }

  public async signInWithOtp(request: OtpRequestDto): Promise<void> {
    const userId = await this._authenticationRepository.getUserIdFromRequest(request.email)

    if (!userId) {
      await this._authenticationRepository.createUserOtp(request.email)
    }

    const link = await this._authenticationRepository.generateMagicLink(request.email)

    await this._mailService.sendMagicLink(request.email, link)
  }

  public async getProfileByUserId(userId: string): Promise<UserProfileDto> {
    return await this._authenticationRepository.getProfileByUserId(userId)
  }
}
