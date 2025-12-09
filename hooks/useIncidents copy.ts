import { useQuery } from "@tanstack/react-query";
import { incidentService } from "@/services/api";
import { Incident, PaginatedResponse } from "@/types/types";

export function useIncidents(params?: {
  page?: number;
  per_page?: number;
  severity?: "HARD" | "SOFT" | undefined;
  search?: string;
}) {
  const queryKey = ["incidents", params];

  return useQuery<PaginatedResponse<Incident>>({
    queryKey,
    queryFn: async () => {
      const res = await incidentService.getAll(params);
      return res.data;
    },
  });
}

export function useIncidentStadistic() {
  return useQuery({
    queryKey: ["incidents-stats"],
    queryFn: async () => {
      const res = await incidentService.getStatistics();
      return res.data;
    },
  });
}
