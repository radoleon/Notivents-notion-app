import { Injectable } from '@nestjs/common'
import { WorkspaceRole } from 'src/dtos/setup/WorkspaceRole'
import { SupabaseFactory } from 'src/supabase/supabase.factory'

@Injectable()
export class SetupRepository {
  constructor(private readonly _supabase: SupabaseFactory) {}

  public async getWorkspaceTokenByUserId(userId: string): Promise<string | null> {
    const { data, error } = await this._supabase.client
      .from('t_workspace_tokens')
      .select('id')
      .eq('profile_id', userId)
      .limit(1)
      .maybeSingle()

    if (error) throw error

    return data ? data.id : null
  }

  public async getWorkspaceRoleByTokenId(tokenId: string): Promise<WorkspaceRole> {
    const { data, error } = await this._supabase.client
      .from('t_workspace_members')
      .select('workspace_id, member_role_id')
      .eq('workspace_token_id', tokenId)
      .limit(1)
      .single()

    if (error) throw error

    return data
  }

  public async getAnyDatabaseIdByWorkspaceId(workspaceId: string): Promise<string | null> {
    const { data, error } = await this._supabase.client
      .from('t_databases')
      .select('id')
      .eq('workspace_id', workspaceId)
      .limit(1)
      .maybeSingle()

    if (error) throw error

    return data ? data.id : null
  }
}
