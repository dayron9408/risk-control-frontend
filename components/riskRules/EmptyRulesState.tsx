'use client';

import { Shield } from 'lucide-react';

interface EmptyRulesStateProps {
    hasFilters: boolean;
    searchTerm?: string;
    typeFilter?: string;
    statusFilter?: string;
    severityFilter?: string;
}

export default function EmptyRulesState({
    hasFilters,
}: EmptyRulesStateProps) {
    return (
        <div className="col-span-full text-center py-12">
            <Shield className="h-16 w-16 mx-auto text-base-content/20 mb-4" />
            <h3 className="text-lg font-semibold text-base-content mb-2">
                {hasFilters ? 'No se encontraron reglas' : 'No hay reglas configuradas'}
            </h3>
            <p className="text-base-content/70 mb-6">
                {hasFilters
                    ? 'Intenta con otros términos de búsqueda'
                    : 'Crea tu primera regla para comenzar a monitorear el riesgo'
                }
            </p>
        </div>
    );
}