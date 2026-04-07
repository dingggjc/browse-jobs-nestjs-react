export interface Job {
  id: number;
  title: string;
  company: string;
  category: string;
  type: string;
  location: string;
  salary?: string;
  description: string;
  postedAt: string;
}