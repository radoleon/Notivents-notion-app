import { Injectable } from '@nestjs/common'
import { GetWorkspaceResponseDto } from 'src/dtos/database/GetWorkspaceResponseDto'
import { TrackedDatabaseDto } from 'src/dtos/database/TrackedDatabaseDto'
import { TDatabase } from 'src/models/Database'
import { SupabaseFactory } from 'src/supabase/supabase.factory'

@Injectable()
export class DatabaseRepository {
  constructor(private readonly _supabase: SupabaseFactory) {}

  public async hasUserAnyDatabase(userId: string): Promise<boolean> {
    const { data, error } = await this._supabase.client
      .from('v_workspace_access')
      .select('database_id')
      .eq('profile_id', userId)
      .limit(1)
      .single()

    if (error) throw error

    return data.database_id !== null
  }

  public async getWorkspaceIdByUserId(userId: string): Promise<string> {
    const { data, error } = await this._supabase.client
      .from('v_workspace_access')
      .select('workspace_id')
      .eq('profile_id', userId)
      .limit(1)
      .single()

    if (error) throw error

    return data.workspace_id
  }

  public async addDatabases(databasesToAdd: TDatabase[]): Promise<void> {
    const { error } = await this._supabase.client.from('t_databases').insert(databasesToAdd)

    if (error) throw error
  }

  public async getWorkspaceWithDatabases(workspaceId: string): Promise<GetWorkspaceResponseDto> {
    const { data, error } = await this._supabase.client
      .from('t_workspaces')
      .select('*, databases:t_databases(*)')
      .eq('id', workspaceId)
      .limit(1)
      .single()

    if (error) throw error

    return data
  }

  public async getTrackedDatabasesByWorkspaceId(workspaceId: string): Promise<TrackedDatabaseDto[]> {
    const { data, error } = await this._supabase.client
      .from('t_databases')
      .select('id, notion_database_id, notion_date_property_id')
      .eq('workspace_id', workspaceId)
      .eq('is_tracked', true)

    if (error) throw error

    return data
  }

  public async updateDatabaseStatus(databaseId: string, status: string): Promise<void> {
    const { error } = await this._supabase.client
      .from('t_databases')
      .update({ status, is_tracked: false })
      .eq('id', databaseId)

    if (error) throw error
  }
}
