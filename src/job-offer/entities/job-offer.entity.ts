import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity('job_offers')
export class JobOffer {
  @ApiProperty({ example: 1, description: 'The internal unique identifier.' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'Senior Backend Engineer',
    description: 'The title of the job offer.',
  })
  @Index()
  @Column()
  title: string;

  @ApiProperty({
    example: 'Tech Solutions Inc.',
    description: 'The company name.',
  })
  @Column()
  company: string;

  @ApiProperty({ example: 'New York, NY', description: 'The job location.' })
  @Column()
  location: string;

  @ApiProperty({
    example: 120000,
    description: 'The minimum salary for the job.',
    nullable: true,
  })
  @Column({ type: 'int', nullable: true })
  salaryMin: number | null;

  @ApiProperty({
    example: 150000,
    description: 'The maximum salary for the job.',
    nullable: true,
  })
  @Column({ type: 'int', nullable: true })
  salaryMax: number | null;

  @ApiProperty({
    example: 'USD',
    description: 'The currency of the salary.',
    nullable: true,
  })
  @Column({ type: 'varchar', length: 4, nullable: true })
  currency: string | null;

  @ApiProperty({ description: 'The date the job was posted.' })
  @Column({ type: 'datetime' })
  postedDate: Date;

  @ApiProperty({
    example: ['Node.js', 'TypeScript', 'MySQL'],
    description: 'A list of required skills.',
    nullable: true,
  })
  @Column('simple-array', { nullable: true })
  skills: string[] | null;

  @ApiProperty({
    example: 'provider1-abc-123',
    description: 'The unique identifier from the external source.',
  })
  @Column({ type: 'varchar', length: 20, unique: true })
  externalId: string | null;

  @ApiProperty({
    example: 'provider1',
    description: 'The source of the job offer.',
  })
  @Column({ type: 'varchar', length: 10, nullable: true })
  source: string | null;
}
