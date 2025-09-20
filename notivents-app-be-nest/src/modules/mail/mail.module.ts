import { Module } from '@nestjs/common'
import { MailFactory } from './mail.factory'
import { MailService } from './mail.service'

@Module({
  providers: [MailService, MailFactory],
  exports: [MailService]
})
export class MailModule {}
