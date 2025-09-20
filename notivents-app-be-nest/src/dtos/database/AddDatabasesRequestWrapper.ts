import { Type } from 'class-transformer'
import { ArrayNotEmpty, IsArray, ValidateNested } from 'class-validator'
import { AddDatabaseRequestDto } from './AddDatabaseRequestDto'

export class AddDatabasesRequestWrapper {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => AddDatabaseRequestDto)
  data: AddDatabaseRequestDto[]
}
