'use client';

import { useState } from 'react';
import { useDeleteRiskRule, useRiskRules, useToggleRiskRuleActive } from '@/hooks/useRiskRules';
import { AlertTriangle, Plus } from 'lucide-react';

import RulesStats from '@/components/riskRules/RulesStats';
import RulesFilters from '@/components/riskRules/RulesFilters';
import RulesGrid from '@/components/riskRules/RulesGrid';
import EmptyRulesState from '@/components/riskRules/EmptyRulesState';
import RiskRuleModal from '@/components/riskRules/RiskRuleModal';
import { toast } from 'react-toastify';
import { RiskRule } from '@/types/types';

export default function RulesPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRule, setEditingRule] = useState<RiskRule | undefined>(undefined);

    // Estados para filtros
    const [typeFilter, setTypeFilter] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [severityFilter, setSeverityFilter] = useState<string>('all');

    // Obtener datos
    const { data, isLoading, error, refetch } = useRiskRules();
    const toggleMutation = useToggleRiskRuleActive();
    const deleteMutation = useDeleteRiskRule();

    const handleOpenModal = (rule?: RiskRule) => {
        setEditingRule(rule);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingRule(undefined);
    };

    const handleDelete = async (rule: RiskRule) => {
        if (confirm(`¿Está seguro de eliminar la regla "${rule.name}"?`)) {
            try {
                await deleteMutation.mutateAsync(rule.id);
                toast.success('Regla eliminada correctamente');
            } catch {
                toast.error('Error al eliminar la regla');
            }
        }
    };

    const handleToggle = async (id: number) => {
        toggleMutation.mutate(id);
    };



    // Estados de carga y error
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="loading loading-spinner loading-lg text-primary"></div>
                    <p className="mt-4 text-base-content/70">Cargando reglas de riesgo...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-error bg-error/20 border-error/30">
                <AlertTriangle className="h-6 w-6 text-error" />
                <div>
                    <span className="text-error">Error cargando reglas: {(error as Error).message}</span>
                    <button
                        className="btn btn-sm bg-error/10 border-error/30 text-error hover:bg-error/20 ml-4"
                        onClick={() => window.location.reload()}
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    const allRules = data?.data || [];

    // Filtrar reglas
    const filteredRules = allRules.filter(rule => {
        const matchesType = typeFilter === 'all' || rule.type === typeFilter;
        const matchesStatus = statusFilter === 'all' ||
            (statusFilter === 'active' && rule.is_active) ||
            (statusFilter === 'inactive' && !rule.is_active);
        const matchesSeverity = severityFilter === 'all' || rule.severity === severityFilter;

        return matchesType && matchesStatus && matchesSeverity;
    });

    // Calcular estadísticas
    const activeRules = allRules.filter(r => r.is_active);
    const hardRules = allRules.filter(r => r.severity === 'HARD');
    const softRules = allRules.filter(r => r.severity === 'SOFT');

    // Verificar si hay filtros activos
    const hasActiveFilters =
        typeFilter !== 'all' ||
        statusFilter !== 'all' ||
        severityFilter !== 'all';

    const handleOnSuccess = () => {
        refetch()
        toast.success('Nueva regla creada exitosamente')
    }

    return (
        <>
            <div>
                {/* Header */}
                <div className="mb-8 p-6 bg-gradient-to-r from-base-200 to-base-300 rounded-2xl border border-primary/20">
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-boldt text-primary bg-clip-text">
                                Reglas de Riesgo
                            </h1>
                            <p className="text-base-content/80 mt-2 text-lg">
                                Configura y gestiona las reglas de control de riesgo del sistema
                            </p>
                        </div>
                        <button
                            onClick={() => handleOpenModal()}
                            className="btn btn-primary mt-4 md:mt-0 border-0 hover:shadow-lg hover:shadow-primary/30"
                        >
                            <Plus className="h-5 w-5 mr-2" />
                            Nueva Regla
                        </button>
                    </div>
                </div>

                {/* Estadísticas */}
                <RulesStats
                    totalRules={allRules.length}
                    activeRules={activeRules.length}
                    hardRules={hardRules.length}
                    softRules={softRules.length}
                />

                {/* Filtros */}
                <RulesFilters
                    typeFilter={typeFilter}
                    statusFilter={statusFilter}
                    severityFilter={severityFilter}
                    onTypeFilterChange={setTypeFilter}
                    onStatusFilterChange={setStatusFilter}
                    onSeverityFilterChange={setSeverityFilter}
                />

                {/* Grid de reglas o estado vacío */}
                {filteredRules.length === 0 ? (
                    <EmptyRulesState
                        hasFilters={hasActiveFilters}
                        typeFilter={typeFilter}
                        statusFilter={statusFilter}
                        severityFilter={severityFilter}
                    />
                ) : (
                    <RulesGrid
                        rules={filteredRules}
                        onEditRule={(rule) => handleOpenModal(rule)}
                        onToggleRule={(id) => handleToggle(id)}
                        onRemoveRule={(rule) => handleDelete(rule)}
                    />
                )}
            </div>

            {/* Modal para crear/editar reglas */}
            <RiskRuleModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                rule={editingRule}
                onSuccess={handleOnSuccess}
            />
        </>
    );
}