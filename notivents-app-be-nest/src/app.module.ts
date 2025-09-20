import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { GuardsModule } from './guards/guards.module'
import { HttpModule } from './http/http.module'
import { AuthenticationModule } from './modules/authentication/authentication.module'
import { DatabaseModule } from './modules/database/database.module'
import { NotionModule } from './modules/notion/notion.module'
import { PageModule } from './modules/page/page.module'
import { SetupModule } from './modules/setup/setup.module'
import { SynchronizationModule } from './modules/synchronization/synchronization.module'
import { SupabaseModule } from './supabase/supabase.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env.development' }),
    GuardsModule,
    SupabaseModule,
    HttpModule,
    SetupModule,
    AuthenticationModule,
    NotionModule,
    DatabaseModule,
    PageModule,
    SynchronizationModule
  ]
})
export class AppModule {}
