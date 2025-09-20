import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common'
import { Identity } from 'src/decorators/identity.decorator'
import { AddDatabasesRequestWrapper } from 'src/dtos/database/AddDatabasesRequestWrapper'
import { GetWorkspaceResponseDto } from 'src/dtos/database/GetWorkspaceResponseDto'
import { AuthGuard } from 'src/guards/auth.guard'
import { DatabaseService } from './database.service'

@Controller('database')
export class DatabaseController {
  constructor(private readonly _databaseService: DatabaseService) {}

  @Post()
  @UseGuards(AuthGuard)
  public async addDatabases(@Body() request: AddDatabasesRequestWrapper, @Identity() userId: string): Promise<void> {
    await this._databaseService.addDatabases(request, userId)
  }

  @Get('workspace')
  @UseGuards(AuthGuard)
  public async getWorkspaceWithDatabases(@Identity() userId: string): Promise<GetWorkspaceResponseDto> {
    return this._databaseService.getWorkspaceWithDatabases(userId)
  }
}
