'use client';

import { X, Filter, Zap, Shield } from 'lucide-react';

interface RulesFiltersProps {
    typeFilter: string;
    statusFilter: string;
    severityFilter: string;
    onTypeFilterChange: (value: string) => void;
    onStatusFilterChange: (value: string) => void;
    onSeverityFilterChange: (value: string) => void;
}

export default function RulesFilters({
    typeFilter,
    statusFilter,
    severityFilter,
    onTypeFilterChange,
    onStatusFilterChange,
    onSeverityFilterChange
}: RulesFiltersProps) {

    const hasActiveFilters =
        typeFilter !== 'all' ||
        statusFilter !== 'all' ||
        severityFilter !== 'all'


    const handleClearFilters = () => {
        onTypeFilterChange('all');
        onStatusFilterChange('all');
        onSeverityFilterChange('all');
    };

    return (
        <div className="card bg-base-200 border border-primary/20 shadow-2xl mb-8">
            <div className="card-body p-6">
                {/* Filtros distribuidos en 3 columnas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {/* Grupo 1: Tipo de Regla */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-base-content/70 flex items-center gap-2">
                            <Filter className="h-4 w-4" />
                            Tipo de Regla
                        </label>
                        <div className="join w-full">
                            {[
                                { value: 'all', label: 'Todos', active: typeFilter === 'all' },
                                { value: 'DURATION', label: 'Duración', active: typeFilter === 'DURATION', color: 'info' },
                                { value: 'VOLUME', label: 'Volumen', active: typeFilter === 'VOLUME', color: 'success' },
                                { value: 'OPEN_TRADES', label: 'Trades', active: typeFilter === 'OPEN_TRADES', color: 'warning' }
                            ].map((option) => (
                                <button
                                    key={option.value}
                                    className={`join-item btn flex-1 ${option.active
                                        ? `bg-${option.color || 'primary'}/20 border-${option.color || 'primary'}/50 text-${option.color || 'primary'}`
                                        : 'border-base-300 text-base-content hover:bg-base-300'
                                        }`}
                                    onClick={() => onTypeFilterChange(option.value)}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Grupo 2: Estado */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-base-content/70 flex items-center gap-2">
                            <Zap className="h-4 w-4" />
                            Estado
                        </label>
                        <div className="join w-full">
                            {[
                                { value: 'all', label: 'Todos', active: statusFilter === 'all' },
                                { value: 'active', label: 'Activas', active: statusFilter === 'active', color: 'success' },
                                { value: 'inactive', label: 'Inactivas', active: statusFilter === 'inactive', color: 'error' }
                            ].map((option) => (
                                <button
                                    key={option.value}
                                    className={`join-item btn flex-1 ${option.active
                                        ? `bg-${option.color || 'primary'}/20 border-${option.color || 'primary'}/50 text-${option.color || 'primary'}`
                                        : 'border-base-300 text-base-content hover:bg-base-300'
                                        }`}
                                    onClick={() => onStatusFilterChange(option.value)}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Grupo 3: Severidad */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-base-content/70 flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            Severidad
                        </label>
                        <div className="join w-full">
                            {[
                                { value: 'all', label: 'Todas', active: severityFilter === 'all' },
                                { value: 'HARD', label: 'Duras', active: severityFilter === 'HARD', color: 'error' },
                                { value: 'SOFT', label: 'Suaves', active: severityFilter === 'SOFT', color: 'warning' }
                            ].map((option) => (
                                <button
                                    key={option.value}
                                    className={`join-item btn flex-1 ${option.active
                                        ? `bg-${option.color || 'primary'}/20 border-${option.color || 'primary'}/50 text-${option.color || 'primary'}`
                                        : 'border-base-300 text-base-content hover:bg-base-300'
                                        }`}
                                    onClick={() => onSeverityFilterChange(option.value)}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Fila de Filtros Activos + Botón Limpiar */}
                {hasActiveFilters && (
                    <div className="mt-4 pt-4 border-t border-base-300">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex flex-wrap items-center gap-2 text-sm text-base-content/70">
                                <Filter className="h-4 w-4" />
                                <span>Filtros activos:</span>
                                {typeFilter !== 'all' && (
                                    <span className="badge badge-sm border-info/30 bg-info/20 text-info">
                                        Tipo: {typeFilter === 'DURATION' ? 'Duración' : typeFilter === 'VOLUME' ? 'Volumen' : 'Trades'}
                                    </span>
                                )}
                                {statusFilter !== 'all' && (
                                    <span className="badge badge-sm border-success/30 bg-success/20 text-success">
                                        Estado: {statusFilter === 'active' ? 'Activas' : 'Inactivas'}
                                    </span>
                                )}
                                {severityFilter !== 'all' && (
                                    <span className="badge badge-sm border-warning/30 bg-warning/20 text-warning">
                                        Severidad: {severityFilter === 'HARD' ? 'Duras' : 'Suaves'}
                                    </span>
                                )}
                            </div>

                            <button
                                className="btn btn-outline btn-sm border-error/30 text-error hover:bg-error/20 self-start sm:self-center"
                                onClick={handleClearFilters}
                            >
                                <X className="h-4 w-4 mr-2" />
                                Limpiar Filtros
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}