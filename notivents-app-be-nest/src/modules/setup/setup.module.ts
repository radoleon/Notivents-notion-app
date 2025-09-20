import { Module } from '@nestjs/common'
import { SetupController } from './setup.controller'
import { SetupRepository } from './setup.repository'
import { SetupService } from './setup.service'

@Module({
  controllers: [SetupController],
  providers: [SetupService, SetupRepository]
})
export class SetupModule {}
