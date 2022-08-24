import { BaseDto } from '@core/dto/base.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { MAINTENANCE_TEAM_CONST } from '@components/maintenance-team/maintenance-team.constant';
import { MaintenanceTeamMemberRequestDto } from './maintenance-team-member.request.dto';

export class CreateMaintenanceTeamRequestDto extends BaseDto {
  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsString()
  @MaxLength(MAINTENANCE_TEAM_CONST.CODE.MAX_LENGTH)
  @Matches(MAINTENANCE_TEAM_CONST.CODE.REGEX)
  code: string;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsString()
  @MaxLength(MAINTENANCE_TEAM_CONST.NAME.MAX_LENGTH)
  @Matches(MAINTENANCE_TEAM_CONST.NAME.REGEX)
  name: string;

  @ApiProperty()
  @Expose()
  @IsString()
  @MaxLength(MAINTENANCE_TEAM_CONST.DESCRIPTION.MAX_LENGTH)
  @IsOptional()
  description: string;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @ValidateNested()
  @IsArray()
  @Type(() => MaintenanceTeamMemberRequestDto)
  members: MaintenanceTeamMemberRequestDto[];
}
