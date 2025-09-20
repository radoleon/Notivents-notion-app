import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { createClient, SupabaseClient } from '@supabase/supabase-js'

@Injectable()
export class SupabaseFactory {
  private _supabaseClient: SupabaseClient

  constructor(private readonly _configService: ConfigService) {
    const supabase_url = this._configService.get<string>('SUPABASE_URL')!
    const supabase_key = this._configService.get<string>('SUPABASE_API_KEY')!

    this._supabaseClient = createClient(supabase_url, supabase_key, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false
      }
    })
  }

  get client(): SupabaseClient {
    return this._supabaseClient
  }
}
