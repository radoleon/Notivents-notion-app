import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { Identity } from 'src/decorators/identity.decorator'
import { GetPagesRequestDto } from 'src/dtos/page/GetPagesRequestDto'
import { AuthGuard } from 'src/guards/auth.guard'
import { PageService } from './page.service'

@Controller('page')
export class PageController {
  constructor(private readonly _pageService: PageService) {}

  @Post()
  @UseGuards(AuthGuard)
  public async getPagesWithEvents(@Body() request: GetPagesRequestDto, @Identity() userId: string) {
    return await this._pageService.getPagesWithEvents(request, userId)
  }
}
