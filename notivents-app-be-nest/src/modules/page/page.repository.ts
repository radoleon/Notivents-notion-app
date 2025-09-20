import { Injectable } from '@nestjs/common'
import { SupabaseFactory } from 'src/supabase/supabase.factory'

@Injectable()
export class PageRepository {
  constructor(private readonly _supabase: SupabaseFactory) {}
}
