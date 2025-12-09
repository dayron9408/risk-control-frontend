import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { riskRuleService } from "@/services/api";
import { RiskRule } from "@/types/types";

export function useRiskRules(params?: { page?: number; per_page?: number }) {
  return useQuery({
    queryKey: ["risk-rules", params],
    queryFn: async () => {
      const res = await riskRuleService.getAll(params);
      return res.data;
    },
  });
}

export function useRiskRule(id: number) {
  return useQuery({
    queryKey: ["risk-rule", id],
    queryFn: async () => {
      const res = await riskRuleService.getById(id);
      return res.data;
    },
    enabled: !!id,
  });
}

export function useCreateRiskRule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<RiskRule>) => riskRuleService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["risk-rules"] });
    },
  });
}

export function useUpdateRiskRule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<RiskRule> }) =>
      riskRuleService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["risk-rules"] });
      queryClient.invalidateQueries({ queryKey: ["risk-rule", variables.id] });
    },
  });
}

export function useDeleteRiskRule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => riskRuleService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["risk-rules"] });
    },
  });
}

export function useToggleRiskRuleActive() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => riskRuleService.toggleActive(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["risk-rules"] });
      queryClient.invalidateQueries({ queryKey: ["risk-rule", id] });
    },
  });
}

export function useAssignRiskRuleActions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, actions }: { id: number; actions: unknown[] }) =>
      riskRuleService.assignActions(id, actions),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["risk-rule", variables.id] });
    },
  });
}

export function useAvailableActionTypes() {
  return useQuery({
    queryKey: ["available-action-types"],
    queryFn: async () => {
      const res = await riskRuleService.getTypesInfo();
      return res.data;
    },
  });
}

export function useRiskRuleTypesInfo() {
  return useQuery({
    queryKey: ["rule-types-info"],
    queryFn: async () => {
      const res = await riskRuleService.getTypesInfo();
      return res.data;
    },
  });
}
