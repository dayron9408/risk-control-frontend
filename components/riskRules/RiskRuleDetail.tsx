'use client';

import { useState } from 'react';
import {
    Shield,
    AlertTriangle,
    Timer,
    BarChart3,
    TrendingUp,
    CheckCircle,
    XCircle,
    Settings,
    Eye,
    Bell,
} from 'lucide-react';
import IncidentsTab from '../accounts/IncidentsTab';
import { riskRuleService } from '@/services/api';
import ActionsTab from './ActionsTab';
import { toast } from 'react-toastify';
import { RiskRule } from '@/types/types';

interface RiskRuleDetailProps {
    rule: RiskRule;
    onUpdate?: (updatedRule: RiskRule) => void;
}

export default function RiskRuleDetail({ rule, onUpdate }: RiskRuleDetailProps) {
    const [activeTab, setActiveTab] = useState<'overview' | 'parameters' | 'incidents' | 'actions'>('overview');
    const [, setIsLoading] = useState(false);

    const getRiskRuleTypeIcon = (type: string) => {
        switch (type) {
            case 'DURATION': return <Timer className="h-5 w-5" />;
            case 'VOLUME': return <BarChart3 className="h-5 w-5" />;
            case 'OPEN_TRADES': return <TrendingUp className="h-5 w-5" />;
            default: return <Shield className="h-5 w-5" />;
        }
    };

    const getRiskRuleTypeText = (type: string) => {
        switch (type) {
            case 'DURATION': return 'Duración de Trade';
            case 'VOLUME': return 'Consistencia de Volumen';
            case 'OPEN_TRADES': return 'Trades Abiertos';
            default: return type;
        }
    };

    const getRiskSeverityColor = (severity: string) => {
        return severity === 'HARD'
            ? 'border-error/30 bg-error/10 text-error'
            : 'border-warning/30 bg-warning/10 text-warning';
    };

    const handleActionAdded = async () => {
        if (onUpdate) {
            setIsLoading(true);
            try {
                const response = await riskRuleService.getById(rule.id);
                onUpdate(response.data);
                toast.success('Nueva acción asignada correctamente')
            } catch {
                toast.error('Error actualizando regla');
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="space-y-6">
            {/* Header con información */}
            <div className="card bg-base-200 border border-primary/20 shadow-2xl">
                <div className="card-body">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl ${rule.is_active ? 'bg-primary/10' : 'bg-base-300'}`}>
                                {getRiskRuleTypeIcon(rule.type)}
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-base-content">{rule.name}</h1>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    <span className={`badge ${getRiskSeverityColor(rule.severity)} gap-1`}>
                                        {rule.severity === 'HARD' ? (
                                            <XCircle className="h-3 w-3" />
                                        ) : (
                                            <AlertTriangle className="h-3 w-3" />
                                        )}
                                        {rule.severity === 'HARD' ? 'Regla Dura' : 'Regla Suave'}
                                    </span>
                                    <span className={`badge ${rule.is_active ? 'border-success/30 bg-success/10 text-success' : 'border-base-content/30 bg-base-content/10 text-base-content/70'} gap-1`}>
                                        {rule.is_active ? (
                                            <CheckCircle className="h-3 w-3" />
                                        ) : (
                                            <XCircle className="h-3 w-3" />
                                        )}
                                        {rule.is_active ? 'Activa' : 'Inactiva'}
                                    </span>
                                    <span className="badge border border-info/30 bg-info/10 text-info gap-1">
                                        {getRiskRuleTypeIcon(rule.type)}
                                        {getRiskRuleTypeText(rule.type)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="tabs tabs-boxed bg-base-300 p-1 rounded-xl">
                <button
                    className={`tab tab-lg ${activeTab === 'overview' ? 'tab-active bg-base-100' : ''}`}
                    onClick={() => setActiveTab('overview')}
                >
                    <Eye className="h-4 w-4 mr-2" />
                    Resumen
                </button>
                <button
                    className={`tab tab-lg ${activeTab === 'parameters' ? 'tab-active bg-base-100' : ''}`}
                    onClick={() => setActiveTab('parameters')}
                >
                    <Settings className="h-4 w-4 mr-2" />
                    Parámetros
                </button>
                <button
                    className={`tab tab-lg ${activeTab === 'incidents' ? 'tab-active bg-base-100' : ''}`}
                    onClick={() => setActiveTab('incidents')}
                >
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Incidentes
                    {rule?.incidents?.length > 0 && (
                        <span className="badge badge-sm badge-warning ml-2">
                            {rule?.incidents.length}
                        </span>
                    )}
                </button>
                <button
                    className={`tab tab-lg ${activeTab === 'actions' ? 'tab-active bg-base-100' : ''}`}
                    onClick={() => setActiveTab('actions')}
                >
                    <Bell className="h-4 w-4 mr-2" />
                    Acciones
                    {rule?.actions?.length > 0 && (
                        <span className="badge badge-sm badge-primary ml-2">
                            {rule?.actions.length}
                        </span>
                    )}
                </button>
            </div>

            {/* Contenido de las tabs */}
            <div className="mt-6">
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        {/* Descripción */}
                        <div className="card bg-base-200 border border-primary/20">
                            <div className="card-body">
                                <h3 className="card-title text-base-content">Descripción</h3>
                                <p className="text-base-content/80">
                                    {rule.description || 'Esta regla no tiene descripción.'}
                                </p>
                            </div>
                        </div>

                        {/* Información básica */}
                        <div className="grid grid-cols-1 gap-6">
                            <div className="card bg-base-200 border border-primary/20">
                                <div className="card-body">
                                    <h3 className="card-title text-base-content mb-4">
                                        <Shield className="h-5 w-5 text-primary" />
                                        Información de la Regla
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between border-b border-base-300 pb-2">
                                            <span className="text-base-content/70">Creada:</span>
                                            <span className="text-sm">{new Date(rule.created_at).toLocaleDateString('es-ES')}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-base-300 pb-2">
                                            <span className="text-base-content/70">Actualizada:</span>
                                            <span className="text-sm">{new Date(rule.updated_at).toLocaleDateString('es-ES')}</span>
                                        </div>
                                        {rule.severity === 'SOFT' && rule.incidents_before_action && (
                                            <div className="flex justify-between">
                                                <span className="text-base-content/70">Incidentes antes de acción:</span>
                                                <span className="font-bold text-warning">{rule.incidents_before_action}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'parameters' && (
                    <div className="card bg-base-200 border border-primary/20">
                        <div className="card-body">
                            <h3 className="card-title text-base-content mb-4">Parámetros de la Regla</h3>

                            {rule.type === 'DURATION' && rule.min_duration_seconds && (
                                <div className="space-y-4">
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-semibold">Duración mínima</span>
                                        </label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="number"
                                                className="input input-bordered w-32"
                                                value={rule.min_duration_seconds}
                                                readOnly
                                            />
                                            <span className="text-base-content/70">segundos</span>
                                        </div>
                                        <div className="text-sm text-base-content/60 mt-1">
                                            Un trade que dure menos de {rule.min_duration_seconds} segundos generará una incidencia.
                                        </div>
                                    </div>
                                </div>
                            )}

                            {rule.type === 'VOLUME' && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text font-semibold">Factor mínimo</span>
                                            </label>
                                            <input
                                                type="number"
                                                step="0.1"
                                                className="input input-bordered"
                                                value={rule.min_factor || ''}
                                                readOnly
                                            />
                                        </div>
                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text font-semibold">Factor máximo</span>
                                            </label>
                                            <input
                                                type="number"
                                                step="0.1"
                                                className="input input-bordered"
                                                value={rule.max_factor || ''}
                                                readOnly
                                            />
                                        </div>
                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text font-semibold">Trades históricos</span>
                                            </label>
                                            <input
                                                type="number"
                                                className="input input-bordered"
                                                value={rule.lookback_trades || ''}
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                    <div className="text-sm text-base-content/60">
                                        El volumen del trade debe estar entre {rule.min_factor} y {rule.max_factor} veces el promedio de los últimos {rule.lookback_trades} trades.
                                    </div>
                                </div>
                            )}

                            {rule.type === 'OPEN_TRADES' && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text font-semibold">Ventana de tiempo</span>
                                            </label>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="number"
                                                    className="input input-bordered"
                                                    value={rule.time_window_minutes || ''}
                                                    readOnly
                                                />
                                                <span className="text-base-content/70">minutos</span>
                                            </div>
                                        </div>
                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text font-semibold">Trades abiertos máximos</span>
                                            </label>
                                            <input
                                                type="number"
                                                className="input input-bordered"
                                                value={rule.max_open_trades || ''}
                                                readOnly
                                                placeholder="Sin límite"
                                            />
                                        </div>
                                    </div>
                                    <div className="text-sm text-base-content/60">
                                        Si en los últimos {rule.time_window_minutes} minutos se abren más de {rule.max_open_trades || '∞'} trades, se generará una incidencia.
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'incidents' && <IncidentsTab incidents={rule?.incidents || []} />}

                {activeTab === 'actions' && (
                    <ActionsTab
                        ruleId={rule.id}
                        actions={rule?.actions || []}
                        onActionAdded={handleActionAdded}
                    />
                )}
            </div>
        </div>
    );
}