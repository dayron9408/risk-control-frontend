'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { accountService } from '@/services/api';
import {
    Users,
    AlertTriangle,
    Shield,
    Activity,
    Zap,
    Clock,
    TrendingUp,
    CheckCircle,
    XCircle,
    Lock,
    Unlock,
} from 'lucide-react';
import TradesTab from './TradesTab';
import IncidentsTab from './IncidentsTab';
import OverviewTab from './OverviewTab';
import { AccountDetails } from '@/types/types';

interface AccountDetailProps {
    account: AccountDetails
}


export default function AccountDetail({ account }: AccountDetailProps) {
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState<'overview' | 'trades' | 'incidents'>('overview');


    // Query para obtener el estado de riesgo
    const { data: riskData, isLoading: riskLoading, } = useQuery({
        queryKey: ['account-risk', account.id],
        queryFn: () => accountService.getRiskStatus(account.id),
        enabled: !!account,
    });

    // Mutaciones para acciones
    const disableTradingMutation = useMutation({
        mutationFn: () => accountService.disableTrading(account.id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['account', account.id] });
            queryClient.invalidateQueries({ queryKey: ['accounts'] });
        },
    });

    const enableTradingMutation = useMutation({
        mutationFn: () => accountService.enableTrading(account.id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['account', account.id] });
            queryClient.invalidateQueries({ queryKey: ['accounts'] });
        },
    });

    const riskLevel = riskData?.data?.risk_level || 'LOW';
    const openTrades = riskData?.data?.open_trades_count || 0;
    const closedTrades = riskData?.data?.closed_trades_count || 0;

    const getRiskColor = (level: string) => {
        switch (level) {
            case 'CRITICAL': return 'bg-error text-error-content';
            case 'HIGH': return 'bg-warning text-warning-content';
            case 'MEDIUM': return 'bg-info text-info-content';
            case 'LOW': return 'bg-success text-success-content';
            default: return 'bg-base-300 text-base-content';
        }
    };

    const getRiskIcon = (level: string) => {
        switch (level) {
            case 'CRITICAL': return <XCircle className="h-5 w-5" />;
            case 'HIGH': return <AlertTriangle className="h-5 w-5" />;
            case 'MEDIUM': return <Shield className="h-5 w-5" />;
            case 'LOW': return <CheckCircle className="h-5 w-5" />;
            default: return <Shield className="h-5 w-5" />;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header con información de la cuenta */}
            <div className="card bg-base-200 border border-primary/20 shadow-2xl">
                <div className="card-body">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="avatar placeholder">
                                <div className="bg-primary/20 text-primary rounded-full w-16 h-16 flex items-center justify-center">
                                    <Users className="h-8 w-8" />
                                </div>
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-base-content">
                                    Cuenta #{account.login}
                                </h1>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    <span className={`badge ${getRiskColor(riskLevel)} gap-1`}>
                                        {getRiskIcon(riskLevel)}
                                        Riesgo: {riskLevel}
                                    </span>
                                    <span className={`badge ${account.status === 'enable' ? 'badge-success' : 'badge-error'} gap-1`}>
                                        {account.status === 'enable' ? (
                                            <CheckCircle className="h-3 w-3" />
                                        ) : (
                                            <XCircle className="h-3 w-3" />
                                        )}
                                        Cuenta: {account.status === 'enable' ? 'Activa' : 'Inactiva'}
                                    </span>
                                    <span className={`badge ${account.trading_status === 'enable' ? 'badge-success' : 'badge-error'} gap-1`}>
                                        {account.trading_status === 'enable' ? (
                                            <Zap className="h-3 w-3" />
                                        ) : (
                                            <Lock className="h-3 w-3" />
                                        )}
                                        Trading: {account.trading_status === 'enable' ? 'Habilitado' : 'Deshabilitado'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {account.trading_status === 'enable' ? (
                                <button
                                    onClick={() => disableTradingMutation.mutate()}
                                    className="btn btn-warning bg-warning/20 text-warning border-warning/30 hover:bg-warning/30"
                                    disabled={disableTradingMutation.isPending}
                                >
                                    <Lock className="h-4 w-4 mr-2" />
                                    Deshabilitar Trading
                                </button>
                            ) : (
                                <button
                                    onClick={() => enableTradingMutation.mutate()}
                                    className="btn btn-success bg-success/20 text-success border-success/30 hover:bg-success/30"
                                    disabled={enableTradingMutation.isPending}
                                >
                                    <Unlock className="h-4 w-4 mr-2" />
                                    Habilitar Trading
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="card bg-base-200 border border-primary/20 shadow-2xl">
                    <div className="card-body p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="stat-title text-base-content/70">Incidentes</div>
                                <div className={`stat-value ${account?.incidents.length > 0 ? 'text-warning' : 'text-success'}`}>
                                    {account.incidents.length}
                                </div>
                            </div>
                            <div className="p-3 bg-warning/10 rounded-xl">
                                <AlertTriangle className="h-8 w-8 text-warning" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card bg-base-200 border border-primary/20 shadow-2xl">
                    <div className="card-body p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="stat-title text-base-content/70">Trades Abiertos</div>
                                <div className="stat-value text-info">{openTrades}</div>
                                <div className="stat-desc text-base-content/60">En curso</div>
                            </div>
                            <div className="p-3 bg-info/10 rounded-xl">
                                <Activity className="h-8 w-8 text-info" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card bg-base-200 border border-primary/20 shadow-2xl">
                    <div className="card-body p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="stat-title text-base-content/70">Trades Cerrados</div>
                                <div className="stat-value text-success">{closedTrades}</div>
                            </div>
                            <div className="p-3 bg-success/10 rounded-xl">
                                <CheckCircle className="h-8 w-8 text-success" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card bg-base-200 border border-primary/20 shadow-2xl">
                    <div className="card-body p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="stat-title text-base-content/70">Creación</div>
                                <div className="stat-value text-base-content">
                                    {new Date(account.created_at).toLocaleDateString('es-ES')}
                                </div>
                                <div className="stat-desc text-base-content/60">
                                    {new Date(account.created_at).toLocaleTimeString('es-ES')}
                                </div>
                            </div>
                            <div className="p-3 bg-primary/10 rounded-xl">
                                <Clock className="h-8 w-8 text-primary" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs de navegación */}
            <div className="tabs tabs-boxed bg-base-300 p-1 rounded-xl">
                <button
                    className={`tab tab-lg ${activeTab === 'overview' ? 'tab-active bg-base-100' : ''}`}
                    onClick={() => setActiveTab('overview')}
                >
                    <Shield className="h-4 w-4 mr-2" />
                    Resumen
                </button>
                <button
                    className={`tab tab-lg ${activeTab === 'trades' ? 'tab-active bg-base-100' : ''}`}
                    onClick={() => setActiveTab('trades')}
                >
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Trades
                    {account?.trades?.length > 0 && (
                        <span className="badge badge-sm badge-primary ml-2">
                            {account.trades.length}
                        </span>
                    )}
                </button>
                <button
                    className={`tab tab-lg ${activeTab === 'incidents' ? 'tab-active bg-base-100' : ''}`}
                    onClick={() => setActiveTab('incidents')}
                >
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Incidentes
                    {account?.incidents?.length > 0 && (
                        <span className="badge badge-sm badge-warning ml-2">
                            {account?.incidents.length}
                        </span>
                    )}
                </button>
            </div>

            {/* Contenido de las tabs */}
            <div className="mt-6">
                {activeTab === 'overview' && (
                    <OverviewTab
                        account={account}
                        riskLoading={riskLoading}
                        riskData={riskData?.data}
                        riskLevel={riskLevel}
                        getRiskColor={getRiskColor}
                        getRiskIcon={getRiskIcon}
                    />
                )}

                {activeTab === 'trades' && <TradesTab trades={account?.trades || []} />}
                {activeTab === 'incidents' && <IncidentsTab incidents={account?.incidents || []} />}
            </div>
        </div>
    );
}