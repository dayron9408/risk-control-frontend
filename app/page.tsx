'use client';
import StatsGrid from '@/components/dashboard/StatsGrid';
import QuickActions from '@/components/dashboard/QuickActions';
import RecentAccounts from '@/components/dashboard/RecentAccounts';
import { useIncidentStadistic } from '@/hooks/useIncidents';
import { useAccounts } from '@/hooks/useAccounts';
import { useRiskRules } from '@/hooks/useRiskRules';

export default function HomePage() {
  const { data: accountsData, isLoading: accountsLoading } = useAccounts()
  const { data: incidentsData, isLoading: incidentsLoading } = useIncidentStadistic()
  const { data: rulesData, isLoading: rulesLoading } = useRiskRules()

  if (accountsLoading || incidentsLoading || rulesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-primary"></div>
          <p className="mt-4 text-base-content/70">Cargando datos del sistema...</p>
          <div className="mt-2 text-xs text-base-content/50 animate-pulse">Conectando con servidores de trading...</div>
        </div>
      </div>
    );
  }


  const accounts = accountsData || null;
  const incidents = incidentsData || null;
  const rules = rulesData || null;

  return (
    <div>
      <div className="mb-8 p-6 text-primary rounded-2xl border border-primary/20">
        <h1 className="text-4xl font-boldt text-primary bg-clip-text">
          Control de Riesgos
        </h1>
        <p className="text-base-content/80 mt-2 text-lg">Monitoreo en tiempo real del sistema de trading</p>
      </div>

      <StatsGrid accounts={accounts} incidents={incidents} rules={rules} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <QuickActions />
        <RecentAccounts accounts={accounts} />
      </div>
    </div>
  );
}