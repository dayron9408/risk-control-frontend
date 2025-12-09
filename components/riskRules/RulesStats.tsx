'use client';

import { Shield, Zap, XCircle, AlertTriangle } from 'lucide-react';

interface RulesStatsProps {
    totalRules: number;
    activeRules: number;
    hardRules: number;
    softRules: number;
}

export default function RulesStats({
    totalRules,
    activeRules,
    hardRules,
    softRules
}: RulesStatsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <div className="card bg-base-200 border border-primary/20 shadow-2xl hover:shadow-primary/20 hover:border-primary/40 transition-all duration-300 group">
                <div className="card-body p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="stat-title text-base-content/70">Total Reglas</div>
                            <div className="stat-value text-primary group-hover:scale-105 transition-transform duration-200">
                                {totalRules}
                            </div>
                            <div className="stat-desc text-base-content/60">Configuradas</div>
                        </div>
                        <div className="p-3 bg-gradient-to-br from-primary/30 to-primary/10 rounded-xl">
                            <Shield className="h-8 w-8 text-primary" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="card bg-base-200 border border-primary/20 shadow-2xl hover:shadow-success/20 hover:border-success/40 transition-all duration-300 group">
                <div className="card-body p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="stat-title text-base-content/70">Reglas Activas</div>
                            <div className="stat-value text-success group-hover:scale-105 transition-transform duration-200">
                                {activeRules}
                            </div>
                            <div className="stat-desc text-base-content/60">
                                {totalRules > 0 ? `${Math.round((activeRules / totalRules) * 100)}%` : '0%'}
                            </div>
                        </div>
                        <div className="p-3 bg-gradient-to-br from-success/30 to-success/10 rounded-xl">
                            <Zap className="h-8 w-8 text-success" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="h-2 bg-base-300 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-success to-accent transition-all duration-500"
                                style={{ width: `${totalRules > 0 ? (activeRules / totalRules) * 100 : 0}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card bg-base-200 border border-primary/20 shadow-2xl hover:shadow-error/20 hover:border-error/40 transition-all duration-300 group">
                <div className="card-body p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="stat-title text-base-content/70">Reglas Duras</div>
                            <div className="stat-value text-error group-hover:scale-105 transition-transform duration-200">
                                {hardRules}
                            </div>
                            <div className="stat-desc text-base-content/60">Acción inmediata</div>
                        </div>
                        <div className="p-3 bg-gradient-to-br from-error/30 to-error/10 rounded-xl">
                            <XCircle className="h-8 w-8 text-error" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="card bg-base-200 border border-primary/20 shadow-2xl hover:shadow-warning/20 hover:border-warning/40 transition-all duration-300 group">
                <div className="card-body p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="stat-title text-base-content/70">Reglas Suaves</div>
                            <div className="stat-value text-warning group-hover:scale-105 transition-transform duration-200">
                                {softRules}
                            </div>
                            <div className="stat-desc text-base-content/60">Acción acumulativa</div>
                        </div>
                        <div className="p-3 bg-gradient-to-br from-warning/30 to-warning/10 rounded-xl">
                            <AlertTriangle className="h-8 w-8 text-warning" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}