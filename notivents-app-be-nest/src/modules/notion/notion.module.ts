import { Module } from '@nestjs/common'
import { NotionController } from './notion.controller'
import { NotionMapper } from './notion.mapper'
import { NotionRepository } from './notion.respository'
import { NotionService } from './notion.service'

@Module({
  controllers: [NotionController],
  providers: [NotionService, NotionRepository, NotionMapper],
  exports: [NotionService]
})
export class NotionModule {}
