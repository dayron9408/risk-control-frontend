// services/api.ts - Versión mejorada con tipos completos
import {
  Account,
  AccountDetails,
  Incident,
  IncidentResponse,
  PaginatedResponse,
  QueryParams,
  RiskData,
  RiskRule,
  RiskRuleConfigResponse,
  Trade,
} from "@/types/types";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "X-API-KEY": API_KEY,
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 10000,
});

// Servicios
export const accountService = {
  getAll: (params?: QueryParams) =>
    api.get<PaginatedResponse<Account>>("/accounts", { params }),
  getById: (id: number) => api.get<AccountDetails>(`/accounts/${id}`),
  getRiskStatus: (id: number) =>
    api.get<RiskData>(`/accounts/${id}/risk-status`),
  disableTrading: (id: number) =>
    api.post<{ message: string; data: Account }>(
      `/accounts/${id}/disable-trading`
    ),
  enableTrading: (id: number) =>
    api.post<{ message: string; data: Account }>(
      `/accounts/${id}/enable-trading`
    ),
  getTrades: (params?: QueryParams) =>
    api.get<PaginatedResponse<Trade>>(`/trades`, { params }),
};

export const riskRuleService = {
  getAll: (params?: QueryParams) =>
    api.get<PaginatedResponse<RiskRule>>("/rules", { params }),
  getById: (id: number) => api.get<RiskRule>(`/rules/${id}`),
  getTypesInfo: () => api.get<RiskRuleConfigResponse>("/rules/types/info"),
  create: (data: Partial<RiskRule>) =>
    api.post<{ message: string; data: RiskRule }>("/rules", data),
  update: (id: number, data: Partial<RiskRule>) =>
    api.put<{ message: string; data: RiskRule }>(`/rules/${id}`, data),
  delete: (id: number) => api.delete<{ message: string }>(`/rules/${id}`),
  toggleActive: (id: number) =>
    api.post<{ message: string; data: unknown }>(`/rules/${id}/toggle-active`),
  assignActions: (id: number, actions: unknown[]) =>
    api.post<{ message: string; data: RiskRule }>(`/rules/${id}/actions`, {
      actions,
    }),
};

export const incidentService = {
  getAll: (params?: QueryParams) =>
    api.get<PaginatedResponse<Incident>>("/incidents", { params }),
  getStatistics: (params?: QueryParams) =>
    api.get<IncidentResponse>("/incidents/statistics", { params }),
  resolve: (id: number) =>
    api.post<{ message: string; data: Incident }>(`/incidents/${id}/resolve`),
  byAccount: (accountId: number) =>
    api.get<PaginatedResponse<Incident>>(`/accounts/${accountId}/incidents`),
  byRule: (ruleId: number) =>
    api.get<PaginatedResponse<Incident>>(`/risk-rules/${ruleId}/incidents`),
};
