import { Module } from '@nestjs/common'
import { NotionModule } from '../notion/notion.module'
import { DatabaseController } from './database.controller'
import { DatabaseRepository } from './database.repository'
import { DatabaseService } from './database.service'

@Module({
  controllers: [DatabaseController],
  providers: [DatabaseService, DatabaseRepository],
  imports: [NotionModule],
  exports: [DatabaseService]
})
export class DatabaseModule {}
