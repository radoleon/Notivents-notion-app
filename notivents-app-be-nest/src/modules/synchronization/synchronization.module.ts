import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { NotionModule } from '../notion/notion.module'
import { SynchronizationController } from './synchronization.controller'
import { SynchronizationRepository } from './synchronization.repository'
import { SynchronizationService } from './synchronization.service'

@Module({
  controllers: [SynchronizationController],
  providers: [SynchronizationService, SynchronizationRepository],
  imports: [DatabaseModule, NotionModule],
  exports: [SynchronizationService]
})
export class SynchronizationModule {}
