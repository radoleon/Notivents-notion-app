import { Global, Module } from '@nestjs/common'
import { HttpFactory } from './http.factory'

@Global()
@Module({
  providers: [HttpFactory],
  exports: [HttpFactory]
})
export class HttpModule {}
