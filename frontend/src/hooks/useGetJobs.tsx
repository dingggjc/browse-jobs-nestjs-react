import { getJobsApi } from "@/api/api";
import { useQuery } from "@tanstack/react-query";

export const useGetJobs = (params: Record<string, string>) => {
  const { data, ...rest } = useQuery({
    queryKey: ['jobs', params],
    queryFn: () => getJobsApi.getJobs(params),
  });

  return { jobs: data, ...rest };
};