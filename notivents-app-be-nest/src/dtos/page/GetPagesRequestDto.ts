import { IsBoolean, IsInt, Max, Min } from 'class-validator'

export class GetPagesRequestDto {
  @IsInt()
  @Min(1900)
  @Max(2100)
  year: number

  @IsInt()
  @Min(1)
  @Max(12)
  month: number

  @IsBoolean()
  synchronize: boolean
}

