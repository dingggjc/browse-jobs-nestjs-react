import type { JobsResponse } from "@/types/jobsResponse";


const API_BASE_URL = import.meta.env.VITE_API_URL;

export const getJobsApi = {
  getJobs: async (params: Record<string, string> = {}): Promise<JobsResponse> => {
    const filtered = Object.fromEntries(
      Object.entries(params).filter(([, v]) => v !== '')
    );
    const query = new URLSearchParams(filtered);
    const url = `${API_BASE_URL}/jobs${query.size ? `?${query}` : ''}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  },
};