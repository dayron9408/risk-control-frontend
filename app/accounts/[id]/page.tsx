// app/accounts/[id]/page.tsx
'use client';

import { useParams, useRouter } from 'next/navigation';
import AccountDetail from '@/components/accounts/AccountDetail';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { useAccount } from '@/hooks/useAccounts';

export default function AccountDetailPage() {
    const params = useParams();
    const router = useRouter();
    const accountId = parseInt(params.id as string);

    const { data, isLoading, error } = useAccount(accountId);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="loading loading-spinner loading-lg text-primary"></div>
                    <p className="mt-4 text-base-content/70">Cargando datos de la cuenta...</p>
                    <div className="mt-2 text-xs text-base-content/50 animate-pulse">
                        Obteniendo información de trading...
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <div className="mb-6">
                    <Link
                        href="/accounts"
                        className="btn btn-ghost btn-sm mb-4 hover:bg-base-300"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Volver a Cuentas
                    </Link>
                </div>

                <div className="card bg-base-200 border border-error/20 shadow-2xl">
                    <div className="card-body">
                        <div className="flex items-center gap-3 mb-4">
                            <AlertTriangle className="h-6 w-6 text-error" />
                            <h3 className="text-lg font-semibold text-error">Error al cargar la cuenta</h3>
                        </div>
                        <p className="text-base-content/70 mb-4">
                            {(error as Error).message || `No se pudo cargar la cuenta con ID ${accountId}`}
                        </p>
                        <div className="card-actions">
                            <button
                                className="btn btn-ghost"
                                onClick={() => router.push('/accounts')}
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Volver a Cuentas
                            </button>
                            <button
                                className="btn btn-outline"
                                onClick={() => window.location.reload()}
                            >
                                Reintentar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const account = data;

    if (!account) {
        return (
            <div>
                <div className="mb-6">
                    <Link
                        href="/accounts"
                        className="btn btn-ghost btn-sm mb-4 hover:bg-base-300"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Volver a Cuentas
                    </Link>
                </div>

                <div className="card bg-base-200 border border-warning/20 shadow-2xl">
                    <div className="card-body">
                        <div className="flex items-center gap-3 mb-4">
                            <AlertTriangle className="h-6 w-6 text-warning" />
                            <h3 className="text-lg font-semibold text-warning">Cuenta no encontrada</h3>
                        </div>
                        <p className="text-base-content/70 mb-4">
                            La cuenta con ID {accountId} no existe o no se pudo encontrar.
                        </p>
                        <button
                            className="btn btn-ghost"
                            onClick={() => router.push('/accounts')}
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Volver a Cuentas
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Navegación */}
            <div className="mb-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/accounts"
                            className="btn btn-ghost btn-sm hover:bg-base-300"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Volver a Cuentas
                        </Link>
                        <div className="hidden md:block">
                            <div className="text-sm breadcrumbs">
                                <ul>
                                    <li><Link href="/accounts">Cuentas</Link></li>
                                    <li><Link href={`/accounts/${account.id}`}>#{account.login}</Link></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Componente de detalle */}
            <AccountDetail account={account} />
        </div>
    );
}