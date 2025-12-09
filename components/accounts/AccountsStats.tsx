// components/accounts/AccountsStats.tsx
'use client';

import { Database, Activity, Shield } from 'lucide-react';

interface AccountsStatsProps {
    totalAccounts: number;
    activeTradingAccounts: number;
    activeAccounts: number;
}

export default function AccountsStats({
    totalAccounts,
    activeTradingAccounts,
    activeAccounts
}: AccountsStatsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="card bg-base-200 border border-primary/20 shadow-2xl hover:shadow-primary/20 hover:border-primary/40 transition-all duration-300 group">
                <div className="card-body p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="stat-title text-base-content/70">Total Cuentas</div>
                            <div className="stat-value text-primary group-hover:scale-105 transition-transform duration-200">
                                {totalAccounts}
                            </div>
                            <div className="stat-desc text-base-content/60">Registradas</div>
                        </div>
                        <div className="p-3 bg-gradient-to-br from-primary/30 to-primary/10 rounded-xl">
                            <Database className="h-8 w-8 text-primary" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="card bg-base-200 border border-success/20 shadow-2xl hover:shadow-success/20 hover:border-success/40 transition-all duration-300 group">
                <div className="card-body p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="stat-title text-base-content/70">Trading Activo</div>
                            <div className="stat-value text-success group-hover:scale-105 transition-transform duration-200">
                                {activeTradingAccounts}
                            </div>
                            <div className="stat-desc text-base-content/60">
                                {totalAccounts > 0 ? `${Math.round((activeTradingAccounts / totalAccounts) * 100)}%` : '0%'} operando
                            </div>
                        </div>
                        <div className="p-3 bg-gradient-to-br from-success/30 to-success/10 rounded-xl">
                            <Activity className="h-8 w-8 text-success" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="h-2 bg-base-300 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-success to-accent transition-all duration-500"
                                style={{ width: `${totalAccounts > 0 ? (activeTradingAccounts / totalAccounts) * 100 : 0}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card bg-base-200 border border-info/20 shadow-2xl hover:shadow-info/20 hover:border-info/40 transition-all duration-300 group">
                <div className="card-body p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="stat-title text-base-content/70">Cuentas Activas</div>
                            <div className="stat-value text-info group-hover:scale-105 transition-transform duration-200">
                                {activeAccounts}
                            </div>
                            <div className="stat-desc text-base-content/60">Habilitadas</div>
                        </div>
                        <div className="p-3 bg-gradient-to-br from-info/30 to-info/10 rounded-xl">
                            <Shield className="h-8 w-8 text-info" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}