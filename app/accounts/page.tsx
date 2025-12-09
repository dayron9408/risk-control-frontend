// app/accounts/page.tsx - VERSIÓN SIMPLIFICADA
'use client';

import { useState } from 'react';
import { useAccounts } from '@/hooks/useAccounts';
import { useRouter } from 'next/navigation';
import { AlertTriangle } from 'lucide-react';

// Importar componentes separados
import AccountsStats from '@/components/accounts/AccountsStats';
import AccountsFilters from '@/components/accounts/AccountsFilters';
import AccountsTable from '@/components/accounts/AccountsTable';
import AccountsPagination from '@/components/accounts/AccountsPagination';
import EmptyAccountsState from '@/components/accounts/EmptyAccountsState';

export default function AccountsPage() {
    const router = useRouter();

    // Estados para filtros
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Estados para paginación
    const [page, setPage] = useState(1);
    const perPage = 15;

    // Obtener datos
    const { data: accountsData, isLoading, error, refetch } = useAccounts({
        page,
        per_page: perPage
    });

    // Estados de carga y error
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="loading loading-spinner loading-lg bg-gradient-to-r from-primary to-secondary"></div>
                    <p className="mt-4 text-base-content/70">Cargando cuentas...</p>
                    <div className="mt-2 text-xs text-base-content/50 animate-pulse">Conectando con servidores de trading...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-error bg-error/20 border-error/30">
                <AlertTriangle className="h-6 w-6 text-error" />
                <div>
                    <span className="text-error">Error cargando cuentas: {(error as Error).message}</span>
                    <button
                        className="btn btn-sm bg-error/10 border-error/30 text-error hover:bg-error/20 ml-4"
                        onClick={() => refetch()}
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    const accounts = accountsData?.data || [];
    const paginationInfo = accountsData || {
        total: 0,
        per_page: perPage,
        current_page: page,
        last_page: 1,
        from: 0,
        to: 0
    };

    // Filtrar cuentas
    const filteredAccounts = accounts.filter(account => {
        const matchesSearch = account.login.toString().includes(searchTerm) || searchTerm === '';
        const matchesStatus = statusFilter === 'all' ||
            (statusFilter === 'active' && account.status === 'enable') ||
            (statusFilter === 'inactive' && account.status === 'disable');

        return matchesSearch && matchesStatus;
    });

    // Calcular estadísticas
    const activeTradingAccounts = accounts.filter(a => a.trading_status === 'enable');
    const activeAccounts = accounts.filter(a => a.status === 'enable');

    // Handlers
    const handleViewDetails = (accountId: number) => {
        router.push(`/accounts/${accountId}`);
    };

    const handleClearFilters = () => {
        setSearchTerm('');
        setStatusFilter('all');
        setPage(1);
    };

    const hasActiveFilters = searchTerm !== '' || statusFilter !== 'all';

    return (
        <div>
            {/* Header */}
            <div className="mb-8 p-6 bg-gradient-to-r from-base-200 to-base-300 rounded-2xl border border-primary/20">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-boldt text-primary bg-clip-text">
                            Cuentas de Trading
                        </h1>
                        <p className="text-base-content/80 mt-2 text-lg">
                            Gestiona y monitorea todas las cuentas del sistema
                        </p>
                    </div>
                </div>
            </div>

            {/* Estadísticas */}
            <AccountsStats
                totalAccounts={accounts.length}
                activeTradingAccounts={activeTradingAccounts.length}
                activeAccounts={activeAccounts.length}
            />

            {/* Filtros */}
            <AccountsFilters
                searchTerm={searchTerm}
                statusFilter={statusFilter}
                onSearchChange={setSearchTerm}
                onStatusFilterChange={setStatusFilter}
                onClearFilters={handleClearFilters}
                hasActiveFilters={hasActiveFilters}
            />

            {/* Tabla de cuentas */}
            <div className="card bg-base-200 border border-accent/20 shadow-2xl">
                <div className="card-body p-0">
                    {filteredAccounts.length === 0 ? (
                        <EmptyAccountsState
                            hasActiveFilters={hasActiveFilters}
                            onClearFilters={handleClearFilters}
                        />
                    ) : (
                        <>
                            <AccountsTable
                                accounts={filteredAccounts}
                                onViewDetails={handleViewDetails}
                            />

                            <AccountsPagination
                                currentPage={paginationInfo.current_page}
                                totalPages={paginationInfo.last_page}
                                totalItems={paginationInfo.total}
                                itemsPerPage={paginationInfo.per_page}
                                showingCount={filteredAccounts.length}
                                onPageChange={setPage}
                            />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}