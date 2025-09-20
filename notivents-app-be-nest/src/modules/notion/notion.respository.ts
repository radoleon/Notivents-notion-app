import { Injectable } from '@nestjs/common'
import { OAuthResponseDto } from 'src/dtos/notion/OAuthResponseDto'
import { SupabaseFactory } from 'src/supabase/supabase.factory'

@Injectable()
export class NotionRepository {
  constructor(private readonly _supabase: SupabaseFactory) {}

  public async hasUserWorkspaceToken(userId: string): Promise<boolean> {
    const { data, error } = await this._supabase.client
      .from('t_workspace_tokens')
      .select('id')
      .eq('profile_id', userId)
      .limit(1)
      .maybeSingle()

    if (error) throw error

    return data !== null
  }

  public async addWorkspaceFromNotionOAuthResponse(userId: string, oauthResponse: OAuthResponseDto): Promise<void> {
    const { error } = await this._supabase.client.rpc('add_notion_oauth_response', {
      p_profile_id: userId,
      p_workspace_response: oauthResponse
    })

    if (error) throw error
  }

  public async getNotionAccessTokenByUserId(userId: string): Promise<string> {
    const { data, error } = await this._supabase.client
      .from('t_workspace_tokens')
      .select('access_token')
      .eq('profile_id', userId)
      .limit(1)
      .single()

    if (error) throw error

    return data.access_token
  }
}
