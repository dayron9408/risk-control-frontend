'use client';

import { useEffect, useState } from 'react';
import { useIncidents } from '@/hooks/useIncidents';
import { useRouter } from 'next/navigation';
import { AlertTriangle } from 'lucide-react';

import IncidentsFilters from '@/components/incidents/IncidentsFilters';
import IncidentsStats from '@/components/incidents/IncidentsStats';
import IncidentsTable from '@/components/incidents/IncidentsTable';
import IncidentsPagination from '@/components/incidents/IncidentsPagination';

export default function IncidentsPage() {
    const router = useRouter();

    // Estado para filtros
    const [severityFilter, setSeverityFilter] = useState<'all' | 'HARD' | 'SOFT'>('all');
    const [searchInput, setSearchInput] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    // Estado para paginación
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Debounce para la búsqueda (1 segundo)
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchInput !== searchTerm) {
                setSearchTerm(searchInput);
                setCurrentPage(1); // Resetear a primera página al buscar
            }
        }, 1000);

        return () => clearTimeout(timer);
    }, [searchInput, searchTerm]);

    // Usar hook con paginación del backend
    const { data: incidentsData, isLoading, error, refetch } = useIncidents({
        page: currentPage,
        per_page: itemsPerPage,
        severity: severityFilter !== 'all' ? severityFilter : undefined,
        search: searchTerm || undefined,
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="loading loading-spinner loading-lg bg-primary"></div>
                    <p className="mt-4 text-base-content/70">Cargando incidentes...</p>
                    <div className="mt-2 text-xs text-base-content/50 animate-pulse">Analizando violaciones de reglas...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-error bg-error/20 border-error/30">
                <AlertTriangle className="h-6 w-6 text-error" />
                <span className="text-error">Error cargando incidentes: {(error as Error).message}</span>
                <button
                    className="btn btn-sm bg-error/10 border-error/30 text-error hover:bg-error/20"
                    onClick={() => refetch()}
                >
                    Reintentar
                </button>
            </div>
        );
    }

    const incidents = incidentsData?.data || [];
    const meta = incidentsData || {
        total: 0,
        per_page: itemsPerPage,
        current_page: currentPage,
        last_page: 1,
        from: 0,
        to: 0
    };

    // Handlers
    const handleViewDetails = (incidentId: number) => {
        router.push(`/incidents/${incidentId}`);
    };

    const handleClearFilters = () => {
        setSeverityFilter('all');
        setSearchInput('');
        setSearchTerm('');
        setCurrentPage(1);
    };

    const handlePageReset = () => {
        setCurrentPage(1);
    };

    const handleItemsPerPageChange = (perPage: number) => {
        setItemsPerPage(perPage);
        setCurrentPage(1);
    };


    const hasActiveFilters = severityFilter !== 'all' || searchTerm !== '';

    return (
        <div>
            {/* Header */}
            <div className="mb-8 p-6 bg-gradient-to-r from-base-200 to-base-300 rounded-2xl border border-primary/20">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-boldt text-primary bg-clip-text">
                            Incidentes de Riesgo
                        </h1>
                        <p className="text-base-content/80 mt-2 text-lg">Monitoreo y gestión de violaciones de reglas</p>
                    </div>
                </div>
            </div>

            <IncidentsStats
                totalIncidents={meta.total}
                filteredIncidents={meta.total}
                currentPage={meta.current_page}
                lastPage={meta.last_page}
                showingCount={incidents.length}
                hasActiveFilters={hasActiveFilters}
            />

            <IncidentsFilters
                severityFilter={severityFilter}
                searchInput={searchInput}
                searchTerm={searchTerm}
                hasActiveFilters={hasActiveFilters}
                onSeverityFilterChange={setSeverityFilter}
                onSearchInputChange={setSearchInput}
                onClearFilters={handleClearFilters}
                onPageReset={handlePageReset}
            />

            <div className="card bg-base-200 border border-primary/20 shadow-2xl">
                <div className="card-body p-0">

                    <IncidentsTable
                        incidents={incidents}
                        onViewDetails={handleViewDetails}
                        hasActiveFilters={hasActiveFilters}
                        onClearFilters={handleClearFilters}
                    />

                    {incidents.length > 0 && (
                        <IncidentsPagination
                            meta={meta}
                            itemsPerPage={itemsPerPage}
                            onPageChange={setCurrentPage}
                            onItemsPerPageChange={handleItemsPerPageChange}
                            hasActiveFilters={hasActiveFilters}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}