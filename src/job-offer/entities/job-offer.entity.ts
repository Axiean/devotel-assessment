import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity('job_offers')
export class JobOffer {
  @PrimaryGeneratedColumn()
  id: number;

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

  @Column({ nullable: true })
  currency: string | null;

  @Column({ type: 'timestamp' })
  postedDate: Date;

  @Column('simple-array', { nullable: true })
  skills: string[] | null;

  @Index()
  @Column({ unique: true })
  externalId: string;

  @Column()
  source: string;
}
