'use client';

import { Search } from 'lucide-react';

interface AccountsFiltersProps {
    searchTerm: string;
    statusFilter: string;
    onSearchChange: (value: string) => void;
    onStatusFilterChange: (value: string) => void;
    onClearFilters?: () => void;
    hasActiveFilters?: boolean;
}

export default function AccountsFilters({
    searchTerm,
    statusFilter,
    onSearchChange,
    onStatusFilterChange,
    onClearFilters,
    hasActiveFilters = false
}: AccountsFiltersProps) {
    return (
        <div className="card bg-base-200 border border-primary/20 shadow-2xl mb-8">
            <div className="card-body p-6">
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-base-content/50" />
                            <input
                                type="text"
                                placeholder="Buscar por login..."
                                className="input input-bordered border-base-300 bg-base-100 w-full pl-10 text-base-content focus:border-primary focus:ring-1 focus:ring-primary/30"
                                value={searchTerm}
                                onChange={(e) => onSearchChange(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <select
                            className="select select-bordered border-base-300 bg-base-100 text-base-content focus:border-primary focus:ring-1 focus:ring-primary/30"
                            value={statusFilter}
                            onChange={(e) => onStatusFilterChange(e.target.value)}
                        >
                            <option value="all">Todos los estados</option>
                            <option value="active">Activas</option>
                            <option value="inactive">Inactivas</option>
                        </select>

                        {hasActiveFilters && onClearFilters && (
                            <button
                                className="btn btn-outline border-base-300 hover:bg-base-300"
                                onClick={onClearFilters}
                            >
                                Limpiar Filtros
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}