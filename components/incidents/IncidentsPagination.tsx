'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface IncidentsPaginationProps {
    meta: {
        total: number;
        per_page: number;
        current_page: number;
        last_page: number;
        from: number;
        to: number;
    };
    itemsPerPage: number;
    onPageChange: (page: number) => void;
    onItemsPerPageChange: (perPage: number) => void;
    hasActiveFilters: boolean;
}

export default function IncidentsPagination({
    meta,
    itemsPerPage,
    onPageChange,
    onItemsPerPageChange,
}: IncidentsPaginationProps) {
    if (meta.total === 0) return null;

    return (
        <>
            {/* Header de tabla con paginación superior */}
            <div className="flex flex-col md:flex-row justify-between items-center p-4 border-b border-base-300/30">
                <div className="flex items-center gap-3">
                    <select
                        value={itemsPerPage}
                        onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                        className="select select-bordered select-sm bg-base-100"
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                    </select>
                </div>
            </div>

            {/* Pagination inferior */}
            <div className="flex flex-col md:flex-row justify-between items-center p-4 border-t border-base-300/30 gap-4">
                <div className="text-sm text-base-content/70">
                    Página {meta.current_page} de {meta.last_page}
                </div>

                <div className="join">
                    <button
                        className="join-item btn btn-sm border-base-300 hover:bg-base-300"
                        disabled={meta.current_page === 1}
                        onClick={() => onPageChange(meta.current_page - 1)}
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Anterior
                    </button>

                    {/* Números de página */}
                    {Array.from({ length: Math.min(5, meta.last_page) }, (_, i) => {
                        let pageNum;
                        if (meta.last_page <= 5) {
                            pageNum = i + 1;
                        } else if (meta.current_page <= 3) {
                            pageNum = i + 1;
                        } else if (meta.current_page >= meta.last_page - 2) {
                            pageNum = meta.last_page - 4 + i;
                        } else {
                            pageNum = meta.current_page - 2 + i;
                        }

                        return (
                            <button
                                key={pageNum}
                                className={`join-item btn btn-sm ${meta.current_page === pageNum ? 'bg-primary/20 border-primary/50 text-primary' : 'border-base-300 hover:bg-base-300'}`}
                                onClick={() => onPageChange(pageNum)}
                            >
                                {pageNum}
                            </button>
                        );
                    })}

                    <button
                        className="join-item btn btn-sm border-base-300 hover:bg-base-300"
                        disabled={meta.current_page === meta.last_page}
                        onClick={() => onPageChange(meta.current_page + 1)}
                    >
                        Siguiente
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>

                <div className="text-sm text-base-content/70">
                    {meta.total} incidentes totales
                </div>
            </div>
        </>
    );
}