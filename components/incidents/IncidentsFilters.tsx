'use client';

import { Search, XCircle, AlertTriangle, X } from 'lucide-react';

interface IncidentsFiltersProps {
    severityFilter: 'all' | 'HARD' | 'SOFT';
    searchInput: string;
    searchTerm: string;
    hasActiveFilters: boolean;
    onSeverityFilterChange: (severity: 'all' | 'HARD' | 'SOFT') => void;
    onSearchInputChange: (value: string) => void;
    onClearFilters: () => void;
    onPageReset: () => void;
}

export default function IncidentsFilters({
    severityFilter,
    searchInput,
    searchTerm,
    hasActiveFilters,
    onSeverityFilterChange,
    onSearchInputChange,
    onClearFilters,
    onPageReset
}: IncidentsFiltersProps) {

    const handleSeverityChange = (severity: 'all' | 'HARD' | 'SOFT') => {
        onSeverityFilterChange(severity);
        onPageReset();
    };

    const handleClearSearch = () => {
        onSearchInputChange('');
        onPageReset();
    };

    return (
        <div className="card bg-base-200 border border-primary/20 shadow-2xl mb-8">
            <div className="card-body p-6">
                <div className="flex flex-col md:flex-row gap-6 items-center">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-base-content/50" />
                            <input
                                type="text"
                                value={searchInput}
                                onChange={(e) => onSearchInputChange(e.target.value)}
                                placeholder="Buscar por login de cuenta o descripción..."
                                className="input input-bordered border-base-300 bg-base-100 w-full pl-10 text-base-content focus:border-primary focus:ring-1 focus:ring-primary/30"
                            />
                            {searchInput && (
                                <button
                                    onClick={handleClearSearch}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-base-content/50 hover:text-base-content"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                        {searchInput !== searchTerm && searchInput && (
                            <div className="pt-2 text-xs text-warning animate-pulse">
                                ⌛ Buscando...
                            </div>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <div className="join">
                            <button
                                className={`join-item btn ${severityFilter === 'all' ? 'bg-primary/20 border-primary/50 text-primary' : 'border-base-300 text-base-content hover:bg-base-300'}`}
                                onClick={() => handleSeverityChange('all')}
                            >
                                Todos
                            </button>
                            <button
                                className={`join-item btn ${severityFilter === 'HARD' ? 'bg-error/20 border-error/50 text-error' : 'border-base-300 text-base-content hover:bg-base-300'}`}
                                onClick={() => handleSeverityChange('HARD')}
                            >
                                <XCircle className="h-4 w-4 mr-2" />
                                Dura
                            </button>
                            <button
                                className={`join-item btn ${severityFilter === 'SOFT' ? 'bg-warning/20 border-warning/50 text-warning' : 'border-base-300 text-base-content hover:bg-base-300'}`}
                                onClick={() => handleSeverityChange('SOFT')}
                            >
                                <AlertTriangle className="h-4 w-4 mr-2" />
                                Suave
                            </button>
                        </div>

                        {hasActiveFilters && (
                            <button
                                className="btn btn-outline btn-sm border-error/30 text-error hover:bg-error/20"
                                onClick={onClearFilters}
                            >
                                <X className="h-4 w-4 mr-1" />
                                Limpiar Filtros
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}