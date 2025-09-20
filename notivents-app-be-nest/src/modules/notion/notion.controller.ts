import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common'
import { Identity } from 'src/decorators/identity.decorator'
import { NotionDatabaseDto } from 'src/dtos/notion/NotionDatabaseDto'
import { AuthGuard } from 'src/guards/auth.guard'
import { NotionService } from './notion.service'
import { OAuthRequestDto } from 'src/dtos/notion/OAuthRequestDto'

@Controller('notion')
export class NotionController {
  constructor(private readonly _notionService: NotionService) {}

  @Post('callback')
  @UseGuards(AuthGuard)
  public async authorizeNotion(@Body() request: OAuthRequestDto, @Identity() userId: string): Promise<void> {
    await this._notionService.exchangeOAuthCodeForWorkspace(request.code, userId)
  }

  @Get('databases')
  @UseGuards(AuthGuard)
  public async getDatabasesFromNotion(@Identity() userId: string): Promise<NotionDatabaseDto[]> {
    return (await this._notionService.getDatabasesFromNotion(userId)).data!
  }
}
