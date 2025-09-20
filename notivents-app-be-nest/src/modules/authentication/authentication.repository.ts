import { Injectable } from '@nestjs/common'
import { UserProfileDto } from 'src/dtos/authentication/UserProfileDto'
import { SupabaseFactory } from 'src/supabase/supabase.factory'

@Injectable()
export class AuthenticationRepository {
  constructor(private readonly _supabase: SupabaseFactory) {}

  public async getUserIdFromRequest(email: string): Promise<string | null> {
    const { data, error } = await this._supabase.client
      .from('v_user_profiles')
      .select('id')
      .eq('email', email)
      .limit(1)
      .maybeSingle()

    if (error) throw error

    return data ? data.id : null
  }

  public async isUserUnconfirmed(userId: string): Promise<boolean> {
    const {
      data: { user },
      error
    } = await this._supabase.client.auth.admin.getUserById(userId)

    if (error) throw error

    return user !== null && !user.email_confirmed_at
  }

  public async isUserOtp(userId: string): Promise<boolean> {
    const { data, error } = await this._supabase.client
      .from('v_user_profiles')
      .select('is_organizer')
      .eq('id', userId)
      .limit(1)
      .single()

    if (error) throw error

    return !data.is_organizer
  }

  public async createUserPwd(email: string, password: string): Promise<void> {
    const { error } = await this._supabase.client.auth.admin.createUser({
      email,
      password,
      app_metadata: { initial_auth: 'pwd' },
      email_confirm: false
    })

    if (error) throw error
  }

  public async createUserOtp(email: string): Promise<void> {
    const { error } = await this._supabase.client.auth.admin.createUser({
      email,
      app_metadata: { initial_auth: 'otp' },
      email_confirm: false
    })

    if (error) throw error
  }

  public async generateSignupLink(email: string, password: string): Promise<string> {
    const { data, error } = await this._supabase.client.auth.admin.generateLink({
      type: 'signup',
      email,
      password,
      options: {
        redirectTo: 'http://localhost:5173/confirm'
      }
    })

    if (error) throw error

    return data.properties.action_link
  }

  public async generateMagicLink(email: string): Promise<string> {
    const { data, error } = await this._supabase.client.auth.admin.generateLink({
      type: 'magiclink',
      email,
      options: {
        redirectTo: 'https://localhost:3000'
      }
    })

    if (error) throw error

    return data.properties.action_link
  }

  public async getProfileByUserId(userId: string): Promise<UserProfileDto> {
    const { data, error } = await this._supabase.client
      .from('v_user_profiles')
      .select('*')
      .eq('id', userId)
      .limit(1)
      .single()

    if (error) throw error

    return data
  }
}
