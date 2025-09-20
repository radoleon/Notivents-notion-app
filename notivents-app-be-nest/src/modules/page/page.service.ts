import { Injectable } from '@nestjs/common'
import { endOfMonth, startOfMonth } from 'date-fns'
import { GetPagesRequestDto } from 'src/dtos/page/GetPagesRequestDto'
import { SyncPeriod } from 'src/dtos/page/SyncPeriod'
import { SynchronizationService } from '../synchronization/synchronization.service'
import { PageRepository } from './page.repository'

@Injectable()
export class PageService {
  constructor(
    private readonly _pageRepository: PageRepository,
    private readonly _synchronizationService: SynchronizationService
  ) {}

  public async getPagesWithEvents(request: GetPagesRequestDto, userId: string) {
    const period: SyncPeriod = {
      start_date: startOfMonth(new Date(request.year, request.month - 1)).toISOString(),
      end_date: endOfMonth(new Date(request.year, request.month - 1)).toISOString()
    }

    return await this._synchronizationService.getSynchronizationLogs(period, request.synchronize, userId)
  }
}
