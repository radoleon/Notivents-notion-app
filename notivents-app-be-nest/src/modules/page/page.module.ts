import { Module } from '@nestjs/common'
import { SynchronizationModule } from '../synchronization/synchronization.module'
import { PageController } from './page.controller'
import { PageRepository } from './page.repository'
import { PageService } from './page.service'

@Module({
  controllers: [PageController],
  providers: [PageService, PageRepository],
  imports: [SynchronizationModule]
})
export class PageModule {}
