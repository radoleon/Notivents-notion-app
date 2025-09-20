import { IsString } from 'class-validator'

export class OAuthRequestDto {
  @IsString()
  code: string
}
