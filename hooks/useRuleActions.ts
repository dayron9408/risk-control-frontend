import { riskRuleService } from "@/services/api";
import { RiskRule } from "@/types/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useRuleActions(ruleId: number) {
  return useQuery({
    queryKey: ["rule-actions", ruleId],
    queryFn: async () => {
      const rule = await riskRuleService.getById(ruleId);
      return rule.data.actions || [];
    },
    enabled: !!ruleId,
  });
}

export function useAvailableActionTypes() {
  return useQuery({
    queryKey: ["available-action-types"],
    queryFn: async () => {
      const response = await riskRuleService.getTypesInfo();
      return response.data.action_types || [];
    },
  });
}

export function useAssignRuleActions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      ruleId,
      actions,
    }: {
      ruleId: number;
      actions: RiskRule[];
    }) => {
      const response = await riskRuleService.assignActions(ruleId, actions);
      return response;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["rule-actions", variables.ruleId],
      });
      queryClient.invalidateQueries({
        queryKey: ["risk-rule", variables.ruleId],
      });
    },
  });
}
