import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { Identity } from 'src/decorators/identity.decorator'
import { AuthGuard } from 'src/guards/auth.guard'
import { SynchronizationService } from './synchronization.service'

@Controller('synchronization')
export class SynchronizationController {
  constructor(private readonly _synchronizationService: SynchronizationService) {}

  @Get('check')
  @UseGuards(AuthGuard)
  public async checkSynchronizationStatus(
    @Query() month: number,
    @Query() year: number,
    @Identity() userId: string
  ): Promise<boolean> {
    return this._synchronizationService.checkSynchronizationStatus(month, year, userId)
  }
}
