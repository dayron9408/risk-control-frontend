'use client';

import { Database, Filter, FileText, Users } from 'lucide-react';

interface IncidentsStatsProps {
    totalIncidents: number;
    filteredIncidents: number;
    currentPage: number;
    lastPage: number;
    showingCount: number;
    hasActiveFilters: boolean;
}

export default function IncidentsStats({
    totalIncidents,
    filteredIncidents,
    currentPage,
    lastPage,
    showingCount,
    hasActiveFilters
}: IncidentsStatsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <div className="card bg-base-200 border border-primary/20 shadow-2xl hover:shadow-primary/20 hover:border-primary/40 transition-all duration-300 group">
                <div className="card-body p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="stat-title text-base-content/70">Total Incidentes</div>
                            <div className="stat-value text-primary group-hover:scale-105 transition-transform duration-200">
                                {totalIncidents}
                            </div>
                            <div className="stat-desc text-base-content/60">
                                {hasActiveFilters ? 'Totales históricos' : 'Registros totales'}
                            </div>
                        </div>
                        <div className="p-3 bg-gradient-to-br from-primary/30 to-primary/10 rounded-xl">
                            <Database className="h-8 w-8 text-primary" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="card bg-base-200 border border-warning/20 shadow-2xl hover:shadow-warning/20 hover:border-warning/40 transition-all duration-300 group">
                <div className="card-body p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="stat-title text-base-content/70">Filtrados</div>
                            <div className="stat-value text-warning group-hover:scale-105 transition-transform duration-200">
                                {filteredIncidents}
                            </div>
                            <div className="stat-desc text-base-content/60">
                                {hasActiveFilters ? 'Con filtros aplicados' : 'Sin filtros'}
                            </div>
                        </div>
                        <div className="p-3 bg-gradient-to-br from-warning/30 to-warning/10 rounded-xl">
                            <Filter className="h-8 w-8 text-warning" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="card bg-base-200 border border-error/20 shadow-2xl hover:shadow-error/20 hover:border-error/40 transition-all duration-300 group">
                <div className="card-body p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="stat-title text-base-content/70">Página Actual</div>
                            <div className="stat-value text-error group-hover:scale-105 transition-transform duration-200">
                                {currentPage}
                            </div>
                            <div className="stat-desc text-base-content/60">
                                de {lastPage} páginas
                            </div>
                        </div>
                        <div className="p-3 bg-gradient-to-br from-error/30 to-error/10 rounded-xl">
                            <FileText className="h-8 w-8 text-error" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="card bg-base-200 border border-success/20 shadow-2xl hover:shadow-success/20 hover:border-success/40 transition-all duration-300 group">
                <div className="card-body p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="stat-title text-base-content/70">Mostrando</div>
                            <div className="stat-value text-success group-hover:scale-105 transition-transform duration-200">
                                {showingCount}
                            </div>
                            <div className="stat-desc text-base-content/60">
                                de {filteredIncidents} incidentes
                            </div>
                        </div>
                        <div className="p-3 bg-gradient-to-br from-success/30 to-success/10 rounded-xl">
                            <Users className="h-8 w-8 text-success" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}