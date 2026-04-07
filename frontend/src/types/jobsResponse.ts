import type { Job } from "./job";

export interface JobsResponse {
  data: Job[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}