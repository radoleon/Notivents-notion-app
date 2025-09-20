import { Injectable } from '@nestjs/common'
import { CheckResponseDto } from 'src/dtos/setup/CheckResponseDto'
import { SetupRepository } from './setup.repository'

@Injectable()
export class SetupService {
  constructor(private readonly _setupRepository: SetupRepository) {}

  public async checkUserSetup(userId: string): Promise<CheckResponseDto> {
    const response: CheckResponseDto = {
      has_workspace: false,
      is_admin: false,
      has_database: false
    }

    const workspaceTokenId = await this._setupRepository.getWorkspaceTokenByUserId(userId)

    if (!workspaceTokenId) {
      return response
    } else {
      response.has_workspace = true
    }

    const workspaceRole = await this._setupRepository.getWorkspaceRoleByTokenId(workspaceTokenId)

    if (workspaceRole.member_role_id !== 1) {
      return response
    } else {
      response.is_admin = true
    }

    const anyDatabaseId = await this._setupRepository.getAnyDatabaseIdByWorkspaceId(workspaceRole.workspace_id)

    if (anyDatabaseId) {
      response.has_database = true
    }

    return response
  }
}
