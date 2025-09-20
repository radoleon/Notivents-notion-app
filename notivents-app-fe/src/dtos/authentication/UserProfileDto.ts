export class UserProfileDto {
  id: string
  username: string | null
  email: string
  is_organizer: boolean
  registered_at: Date
  avatar_url: string | null
  aubscription_plan_id: number | null
}
