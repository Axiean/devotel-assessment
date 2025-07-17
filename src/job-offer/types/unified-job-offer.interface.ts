export interface UnifiedJobOffer {
  title: string;
  company: string;
  location: string;
  salaryMin: number | null;
  salaryMax: number | null;
  currency: string;
  postedDate: Date;
  skills: string[];
  externalId: string;
  source: string;
}
