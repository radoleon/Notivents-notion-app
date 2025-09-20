import { Module } from '@nestjs/common'
import { ThrottlerModule } from '@nestjs/throttler'
import { MailModule } from '../mail/mail.module'
import { AuthenticationController } from './authentication.controller'
import { AuthenticationRepository } from './authentication.repository'
import { AuthenticationService } from './authentication.service'

@Module({
  controllers: [AuthenticationController],
  providers: [AuthenticationService, AuthenticationRepository],
  imports: [ThrottlerModule.forRoot([{ ttl: 0, limit: 0 }]), MailModule]
})
export class AuthenticationModule {}
