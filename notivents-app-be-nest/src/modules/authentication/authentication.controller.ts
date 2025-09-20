import { Body, Controller, Get, HttpCode, Post, UseGuards } from '@nestjs/common'
import { SkipThrottle, Throttle, ThrottlerGuard } from '@nestjs/throttler'
import { Identity } from 'src/decorators/identity.decorator'
import { ConfirmResponseDto } from 'src/dtos/authentication/ConfirmResponseDto'
import { OtpRequestDto } from 'src/dtos/authentication/OtpRequestDto'
import { PwdRequestDto } from 'src/dtos/authentication/PwdRequestDto'
import { SignupResponseDto } from 'src/dtos/authentication/SignupResponseDto'
import { UserProfileDto } from 'src/dtos/authentication/UserProfileDto'
import { AuthGuard } from 'src/guards/auth.guard'
import { AuthenticationService } from './authentication.service'

@Controller('auth')
@UseGuards(ThrottlerGuard)
export class AuthenticationController {
  constructor(private readonly _authenticationService: AuthenticationService) {}

  @Post('signup')
  @Throttle({ default: { ttl: 60, limit: 5 } })
  public async signup(@Body() request: PwdRequestDto): Promise<SignupResponseDto> {
    return await this._authenticationService.signup(request)
  }

  @Post('confirm')
  @HttpCode(200)
  @Throttle({ default: { ttl: 60, limit: 5 } })
  public async confirm(@Body() request: PwdRequestDto): Promise<ConfirmResponseDto> {
    return await this._authenticationService.confirm(request)
  }

  @Post('magiclink')
  @Throttle({ default: { ttl: 60, limit: 5 } })
  public async signInWithOtp(@Body() request: OtpRequestDto): Promise<void> {
    await this._authenticationService.signInWithOtp(request)
  }

  @Get()
  @UseGuards(AuthGuard)
  @SkipThrottle()
  public async getUserProfile(@Identity() userId: string): Promise<UserProfileDto> {
    return await this._authenticationService.getProfileByUserId(userId)
  }
}
