// components/accounts/EmptyAccountsState.tsx
'use client';

import { Users } from 'lucide-react';

interface EmptyAccountsStateProps {
    hasActiveFilters: boolean;
    onClearFilters?: () => void;
}

export default function EmptyAccountsState({
    hasActiveFilters,
    onClearFilters
}: EmptyAccountsStateProps) {
    return (
        <div className="text-center py-12">
            <Users className="h-16 w-16 mx-auto text-base-content/20 mb-4" />
            <h3 className="text-lg font-semibold text-base-content mb-2">No se encontraron cuentas</h3>
            <p className="text-base-content/70 mb-6">
                {hasActiveFilters
                    ? 'Intenta con otros términos de búsqueda'
                    : 'Crea tu primera cuenta de trading'
                }
            </p>
            {hasActiveFilters && onClearFilters && (
                <button
                    className="btn btn-outline border-base-300 hover:bg-base-300"
                    onClick={onClearFilters}
                >
                    Limpiar Filtros
                </button>
            )}
        </div>
    );
}