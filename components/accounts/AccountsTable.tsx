// components/accounts/AccountsTable.tsx
'use client';

import Link from 'next/link';
import { Users, Eye, Zap, Shield, AlertTriangle } from 'lucide-react';
import { Account } from '@/types/types';

interface AccountsTableProps {
    accounts: Account[];
    onViewDetails?: (accountId: number) => void;
}

export default function AccountsTable({ accounts, onViewDetails }: AccountsTableProps) {
    const handleViewDetails = (accountId: number) => {
        if (onViewDetails) {
            onViewDetails(accountId);
        }
    };

    return (
        <div className="overflow-x-auto rounded-xl">
            <table className="table">
                <thead className="bg-base-300/50">
                    <tr>
                        <th className="text-base-content font-semibold">Login</th>
                        <th className="text-base-content font-semibold">Estado del trading</th>
                        <th className="text-base-content font-semibold">Estado de cuenta</th>
                        <th className="text-base-content font-semibold">Fecha de creación</th>
                        <th className="text-base-content font-semibold">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {accounts.map((account) => (
                        <tr key={account.id} className="hover:bg-base-300/30 transition-colors duration-150">
                            <td>
                                <div className="font-bold text-base-content flex items-center gap-2">
                                    <Users className="h-4 w-4 text-base-content/60" />
                                    {account.login}
                                </div>
                            </td>
                            <td>
                                <div className={`badge border gap-1 ${account.trading_status === 'enable' ? 'border-success/30 bg-success/10 text-success' : 'border-error/30 bg-error/10 text-error'}`}>
                                    {account.trading_status === 'enable' ? (
                                        <>
                                            <Zap className="h-3 w-3" />
                                            Activo
                                        </>
                                    ) : (
                                        <>
                                            <AlertTriangle className="h-3 w-3" />
                                            Inactivo
                                        </>
                                    )}
                                </div>
                            </td>
                            <td>
                                <div className={`badge border gap-1 ${account.status === 'enable' ? 'border-info/30 bg-info/10 text-info' : 'border-warning/30 bg-warning/10 text-warning'}`}>
                                    {account.status === 'enable' ? (
                                        <>
                                            <Shield className="h-3 w-3" />
                                            Activa
                                        </>
                                    ) : (
                                        <>
                                            <AlertTriangle className="h-3 w-3" />
                                            Inactiva
                                        </>
                                    )}
                                </div>
                            </td>
                            <td>
                                <div className="text-sm">
                                    <div className="text-base-content">{new Date(account.created_at).toLocaleDateString('es-ES')}</div>
                                    <div className="text-xs text-base-content/60">
                                        {new Date(account.created_at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div className="flex gap-2">
                                    <Link
                                        href={`/accounts/${account.id}`}
                                        className="btn btn-ghost btn-xs text-base-content hover:bg-base-300 hover:text-primary"
                                        onClick={() => handleViewDetails(account.id)}
                                    >
                                        <Eye className="h-4 w-4" />
                                        Ver
                                    </Link>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}