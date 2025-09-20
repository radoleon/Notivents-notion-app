import { Controller, Get, UseGuards } from '@nestjs/common'
import { Identity } from 'src/decorators/identity.decorator'
import { CheckResponseDto } from 'src/dtos/setup/CheckResponseDto'
import { AuthGuard } from 'src/guards/auth.guard'
import { SetupService } from './setup.service'

@Controller('setup')
export class SetupController {
  constructor(private readonly _setupService: SetupService) {}

  @Get('check')
  @UseGuards(AuthGuard)
  public async checkUserSetup(@Identity() userId: string): Promise<CheckResponseDto> {
    return await this._setupService.checkUserSetup(userId)
  }
}
