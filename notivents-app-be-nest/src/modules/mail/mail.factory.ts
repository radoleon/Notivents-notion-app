import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Transporter, createTransport } from 'nodemailer'

@Injectable()
export class MailFactory {
  private _transporter: Transporter

  constructor(private readonly _configService: ConfigService) {
    const smtp_host = this._configService.get<string>('SMTP_HOST')!
    const smtp_port = this._configService.get<number>('SMTP_PORT')!

    this._transporter = createTransport({
      host: smtp_host,
      port: smtp_port,
      secure: false
    })
  }

  get client(): Transporter {
    return this._transporter
  }
}
