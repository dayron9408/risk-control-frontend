'use client';

interface AccountsPaginationProps {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    showingCount: number;
    onPageChange: (page: number) => void;
}

export default function AccountsPagination({
    currentPage,
    totalPages,
    totalItems,
    showingCount,
    onPageChange
}: AccountsPaginationProps) {
    if (totalItems === 0) return null;

    return (
        <div className="flex justify-between items-center p-4 border-t border-base-300/30">
            <div className="text-sm text-base-content/70">
                Página {currentPage} de {totalPages} — Mostrando {showingCount} de {totalItems} cuentas
            </div>
            <div className="join">
                <button
                    className="join-item btn btn-sm border-base-300 hover:bg-base-300"
                    disabled={currentPage === 1}
                    onClick={() => onPageChange(currentPage - 1)}
                >
                    «
                </button>
                <button className="join-item btn btn-sm bg-primary/20 border-primary/50 text-primary">
                    {currentPage}
                </button>
                <button
                    className="join-item btn btn-sm border-base-300 hover:bg-base-300"
                    disabled={currentPage === totalPages}
                    onClick={() => onPageChange(currentPage + 1)}
                >
                    »
                </button>
            </div>
        </div>
    );
}