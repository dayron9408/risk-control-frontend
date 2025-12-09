'use client';

import { Account, RiskData } from '@/types/types';
import { Shield, BarChart3 } from 'lucide-react';

interface OverviewTabProps {
    account: Account;
    riskLoading: boolean;
    riskData?: RiskData;
    riskLevel: string;
    getRiskColor: (level: string) => string;
    getRiskIcon: (level: string) => React.ReactNode;
}

export default function OverviewTab({
    account,
    riskLoading,
    riskData,
    riskLevel,
    getRiskColor,
    getRiskIcon,
}: OverviewTabProps) {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Información de la Cuenta */}
                <div className="card bg-base-200 border border-primary/20 shadow-2xl">
                    <div className="card-body">
                        <h3 className="card-title text-base-content mb-4">
                            <Shield className="h-5 w-5 text-primary" />
                            Información de la Cuenta
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between border-b border-base-300 pb-2">
                                <span className="text-base-content/70">Login:</span>
                                <span className="font-mono font-bold text-primary">{account.login}</span>
                            </div>
                            <div className="flex justify-between border-b border-base-300 pb-2">
                                <span className="text-base-content/70">Estado de Cuenta:</span>
                                <span className={`font-semibold ${account.status === 'enable' ? 'text-success' : 'text-error'}`}>
                                    {account.status === 'enable' ? 'Activa' : 'Inactiva'}
                                </span>
                            </div>
                            <div className="flex justify-between border-b border-base-300 pb-2">
                                <span className="text-base-content/70">Estado de Trading:</span>
                                <span className={`font-semibold ${account.trading_status === 'enable' ? 'text-success' : 'text-error'}`}>
                                    {account.trading_status === 'enable' ? 'Habilitado' : 'Deshabilitado'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-base-content/70">Última actualización:</span>
                                <span className="text-sm text-base-content/60">
                                    {new Date(account.updated_at).toLocaleString('es-ES')}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Estadísticas de Riesgo */}
                <div className="card bg-base-200 border border-primary/20 shadow-2xl">
                    <div className="card-body">
                        <h3 className="card-title text-base-content mb-4">
                            <BarChart3 className="h-5 w-5 text-warning" />
                            Estadísticas de Riesgo
                        </h3>
                        {riskLoading ? (
                            <div className="flex justify-center py-8">
                                <div className="loading loading-spinner loading-lg"></div>
                            </div>
                        ) : riskData ? (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-base-content/70">Nivel de Riesgo:</span>
                                    <span className={`badge ${getRiskColor(riskLevel)} gap-1`}>
                                        {getRiskIcon(riskLevel)}
                                        {riskLevel}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-base-content/70">Incidentes Duros:</span>
                                    <span className="font-bold text-error">
                                        {riskData.incidents_by_severity?.HARD || 0}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-base-content/70">Incidentes Suaves:</span>
                                    <span className="font-bold text-warning">
                                        {riskData.incidents_by_severity?.SOFT || 0}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-base-content/70">Total Incidentes:</span>
                                    <span className="font-bold text-base-content">
                                        {(riskData.incidents_by_severity?.SOFT + riskData.incidents_by_severity?.HARD) || 0}
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-base-content/70">
                                No hay datos de riesgo disponibles
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
