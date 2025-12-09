import { useQuery } from "@tanstack/react-query";
import { accountService } from "@/services/api";

export function useAccounts(params?: { page?: number; per_page?: number }) {
  return useQuery({
    queryKey: ["accounts", params],
    queryFn: async () => {
      const res = await accountService.getAll(params);
      return res.data;
    },
  });
}

export function useAccount(id: number) {
  return useQuery({
    queryKey: ["account", id],
    queryFn: async () => {
      const res = await accountService.getById(id);
      return res.data;
    },
    enabled: !!id,
  });
}


