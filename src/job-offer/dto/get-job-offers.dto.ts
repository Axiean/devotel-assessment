import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetJobOffersDto {
  @ApiProperty({
    required: false,
    description: 'Filter by job title',
    example: 'Software Engineer',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    required: false,
    description: 'Filter by job location',
    example: 'New York, NY',
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({
    required: false,
    description: 'Filter by minimum salary',
    example: 60000,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  minSalary?: number;

  @ApiProperty({
    required: false,
    description: 'Filter by maximum salary',
    example: 120000,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  maxSalary?: number;

  @ApiProperty({
    required: false,
    description: 'The page number for pagination',
    default: 1,
    type: Number,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiProperty({
    required: false,
    description: 'The number of items to return per page',
    default: 10,
    type: Number,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit?: number = 10;
}
