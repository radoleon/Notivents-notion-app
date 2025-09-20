import { Global, Module } from '@nestjs/common';
import { SupabaseFactory } from './supabase.factory';

@Global()
@Module({
  providers: [SupabaseFactory],
  exports: [SupabaseFactory],
})
export class SupabaseModule {}
