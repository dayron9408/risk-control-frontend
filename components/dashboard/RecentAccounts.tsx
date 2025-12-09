'use client';

import { Account, PaginatedResponse } from '@/types/types';
import { Database } from 'lucide-react';
import Link from 'next/link';

interface RecentAccountsProps {
    accounts: PaginatedResponse<Account> | null;
}

export default function RecentAccounts({ accounts }: RecentAccountsProps) {
    return (
        <div className="card bg-base-200 border border-primary/20 shadow-2xl">
            <div className="card-body p-6">
                <h2 className="card-title text-base-content mb-4">
                    <Database className="h-6 w-6 text-info" />
                    Últimas Cuentas
                </h2>
                <div className="overflow-x-auto rounded-xl border border-base-300/30">
                    <table className="table">
                        <thead className="bg-base-300/50">
                            <tr>
                                <th className="text-base-content font-semibold">Login</th>
                                <th className="text-base-content font-semibold">Estado</th>
                                <th className="text-base-content font-semibold">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {accounts?.data.slice(0, 5).map((account, index) => (
                                <tr key={account.id} className="hover:bg-base-300/30 transition-colors duration-150">
                                    <td>
                                        <div className="flex items-center">
                                            <div className="font-bold text-base-content">{account.login}</div>
                                            {index < 3 && (
                                                <span className="badge badge-xs badge-primary ml-2 animate-pulse">Nuevo</span>
                                            )}
                                        </div>
                                        <div className="text-xs text-base-content/60">ID: {account.id}</div>
                                    </td>
                                    <td>
                                        <div className="flex flex-col gap-1.5">
                                            <span className={`badge badge-sm border ${account.trading_status === 'enable' ? 'border-success/30 bg-success/20 text-success' : 'border-error/30 bg-error/20 text-error'}`}>
                                                Trading: {account.trading_status}
                                            </span>
                                            <span className={`badge badge-sm border ${account.status === 'enable' ? 'border-info/30 bg-info/20 text-info' : 'border-warning/30 bg-warning/20 text-warning'}`}>
                                                Cuenta: {account.status}
                                            </span>
                                        </div>
                                    </td>
                                    <td>
                                        <Link
                                            href={`/accounts/${account.id}`}
                                            className="btn btn-ghost btn-xs text-base-content hover:text-primary hover:bg-primary/10"
                                        >
                                            Ver Detalles
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="card-actions justify-end mt-4">
                    <Link href="/accounts" className="link link-primary hover:text-primary/80 font-semibold">
                        <span className="flex items-center">
                            Ver todas las cuentas
                            <div className="ml-1 animate-bounce">→</div>
                        </span>
                    </Link>
                </div>
            </div>
        </div>
    );
}