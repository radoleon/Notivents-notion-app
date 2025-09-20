import { Injectable } from '@nestjs/common'
import { render } from '@react-email/render'
import SignupConfirm from 'emails/SignupConfirm'
import { MailFactory } from './mail.factory'

@Injectable()
export class MailService {
  constructor(private readonly _mailer: MailFactory) {}

  public async sendSignupLink(email: string, link: string): Promise<void> {
    const template = await render(SignupConfirm({ link }))

    await this._mailer.client.sendMail({
      from: `"Notivents" <no-reply@notivents.com>`,
      to: email,
      subject: 'Confirm your email',
      html: template
    })
  }

  public async sendMagicLink(email: string, link: string): Promise<void> {
    return await Promise.resolve()
  }
}
