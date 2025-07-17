import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity('job_offers')
export class JobOffer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column()
  title: string;

  @Column()
  company: string;

  @Column()
  location: string;

  @Column({ type: 'int', nullable: true })
  salaryMin: number | null;

  @Column({ type: 'int', nullable: true })
  salaryMax: number | null;

  @Column({ type: 'varchar', length: 4, nullable: true })
  currency: string | null;

  @Column({ type: 'datetime' })
  postedDate: Date;

  @Column('simple-array', { nullable: true })
  skills: string[] | null;

  @Column({ unique: true })
  externalId: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  source: string | null;
}
