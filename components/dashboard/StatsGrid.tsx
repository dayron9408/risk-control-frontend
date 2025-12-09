'use client';

import { Account, IncidentResponse, PaginatedResponse, RiskRule } from '@/types/types';
import {
    Users,
    AlertTriangle,
    Shield,
    Activity,
    Zap,
} from 'lucide-react';



interface StatsGridProps {
    accounts: PaginatedResponse<Account> | null;
    incidents: IncidentResponse | null;
    rules: PaginatedResponse<RiskRule> | null;
}

export default function StatsGrid({ accounts, incidents, rules }: StatsGridProps) {
    const activeAccounts = accounts?.data.filter(a => a.status === 'enable');
    const activeTrading = accounts?.data.filter(a => a.trading_status === 'enable');

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {/* Cuentas Activas */}
            <div className="card bg-base-200 border border-primary/20 shadow-2xl hover:shadow-primary/20 hover:border-primary/40 transition-all duration-300 group">
                <div className="card-body p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="stat-title text-base-content/70">Cuentas Activas</div>
                            <div className="stat-value text-primary group-hover:scale-105 transition-transform duration-200">
                                {activeAccounts?.length}
                            </div>
                            <div className="stat-desc text-base-content/60">Total: {accounts?.data.length}</div>
                        </div>
                        <div className="p-3 bg-gradient-to-br from-primary/30 to-primary/10 rounded-xl group-hover:from-primary/40 group-hover:to-primary/20 transition-all duration-300">
                            <Users className="h-8 w-8 text-primary" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="h-2 bg-base-300 rounded-full overflow-hidden">
                            <div
                                className="h-full text-primary transition-all duration-500"
                                style={{
                                    width: `${((activeAccounts?.length ?? 0) / (accounts?.data?.length ?? 1)) * 100
                                        }%`
                                }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Trading Activo */}
            <div className="card bg-base-200 border border-primary/20 shadow-2xl hover:shadow-success/20 hover:border-success/40 transition-all duration-300 group">
                <div className="card-body p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="stat-title text-base-content/70">Trading Activo</div>
                            <div className="stat-value text-success group-hover:scale-105 transition-transform duration-200">
                                {activeTrading?.length}
                            </div>
                            <div className="stat-desc text-base-content/60">
                                {(((activeTrading?.length ?? 0) / (accounts?.data.length ?? 1)) * 100).toFixed(0)}% del total
                            </div>

                        </div>
                        <div className="p-3 bg-gradient-to-br from-success/30 to-success/10 rounded-xl group-hover:from-success/40 group-hover:to-success/20 transition-all duration-300">
                            <Activity className="h-8 w-8 text-success" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="h-2 bg-base-300 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-success to-accent transition-all duration-500"
                                style={{
                                    width: `${((activeTrading?.length ?? 0) / (accounts?.data.length ?? 1)) * 100
                                        }%`
                                }}

                            ></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Incidentes */}
            <div className="card bg-base-200 border border-primary/20 shadow-2xl hover:shadow-warning/20 hover:border-warning/40 transition-all duration-300 group">
                <div className="card-body p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="stat-title text-base-content/70">Incidentes hoy</div>
                            {/* total */}
                            <div className="stat-value text-warning group-hover:scale-105 transition-transform duration-200">
                                {incidents?.total || 0}
                            </div>
                            {/* subtítulo con severidad */}
                            <div className="stat-desc text-base-content/60">
                                {incidents?.by_severity?.HARD || 0} HARD · {incidents?.by_severity?.SOFT || 0} SOFT
                            </div>
                        </div>
                        <div className="p-3 bg-gradient-to-br from-warning/30 to-warning/10 rounded-xl group-hover:from-warning/40 group-hover:to-warning/20 transition-all duration-300">
                            <AlertTriangle className="h-8 w-8 text-warning" />
                        </div>
                    </div>


                    {/* sección extra opcional */}
                    <div className="mt-4">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-base-content/70">Criticidad</span>
                            <span className="text-warning font-semibold">
                                {(incidents?.by_severity?.HARD ?? 0) > (incidents?.by_severity?.SOFT ?? 0) ? "Alta" : "Media"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>


            {/* Reglas */}
            <div className="card bg-base-200 border border-primary/20 shadow-2xl hover:shadow-secondary/20 hover:border-secondary/40 transition-all duration-300 group">
                <div className="card-body p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="stat-title text-base-content/70">Reglas de riesgo</div>
                            <div className="stat-value text-secondary group-hover:scale-105 transition-transform duration-200">
                                {rules?.total || 0}
                            </div>
                            <div className="stat-desc text-base-content/60">Configuradas</div>
                        </div>
                        <div className="p-3 bg-gradient-to-br from-secondary/30 to-secondary/10 rounded-xl group-hover:from-secondary/40 group-hover:to-secondary/20 transition-all duration-300">
                            <Shield className="h-8 w-8 text-secondary" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="flex items-center">
                            <Zap className="h-4 w-4 text-accent mr-1" />
                            <span className="text-sm text-base-content/70">100% operativas</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}