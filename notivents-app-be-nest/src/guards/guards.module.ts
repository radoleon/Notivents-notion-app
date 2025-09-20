import { Global, Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { AuthGuard } from './auth.guard'

@Global()
@Module({
  imports: [JwtModule],
  providers: [AuthGuard],
  exports: [AuthGuard, JwtModule]
})
export class GuardsModule {}
