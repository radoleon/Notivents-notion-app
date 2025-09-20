import { IsBoolean, IsString } from 'class-validator'

export class AddDatabaseRequestDto {
  @IsString()
  notion_database_id: string

  @IsString()
  date_property_id: string

  @IsBoolean()
  is_tracked: boolean
}
