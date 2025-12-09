'use client';

import { useState } from 'react';
import { TrendingUp, Plus } from 'lucide-react';
import { Trade } from '@/types/types';

interface TradesTabProps {
    trades: Trade[];
}

// Función para formatear precios
const formatPrice = (price: number | null | undefined) => {
    if (price === null || price === undefined || price === 0) return '-';

    return new Intl.NumberFormat('es-ES', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 5,
        useGrouping: true
    }).format(price);
};

export default function TradesTab({ trades }: TradesTabProps) {
    const [page, setPage] = useState(1);
    const perPage = 10;

    const start = (page - 1) * perPage;
    const end = start + perPage;
    const paginatedTrades = trades.slice(start, end);
    const totalPages = Math.ceil(trades.length / perPage);

    return (
        <div className="card bg-base-200 border border-primary/20 shadow-2xl">
            <div className="card-body">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-base-content">
                        <TrendingUp className="h-5 w-5 inline mr-2" />
                        Trades
                    </h3>
                </div>

                {paginatedTrades.length > 0 ? (
                    <>
                        <div className="overflow-x-auto">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Tipo</th>
                                        <th>Volumen</th>
                                        <th>Estado</th>
                                        <th>Apertura</th>
                                        <th>Precio de inicio</th>
                                        <th>Precio de cierre</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedTrades.map((trade) => {
                                        const isClosed = trade.status === 'closed';
                                        const hasClosePrice = trade.close_price !== null && trade.close_price > 0;
                                        const openPrice = trade.open_price || 0;
                                        const closePrice = trade.close_price || 0;
                                        const difference = hasClosePrice && openPrice > 0
                                            ? closePrice - openPrice
                                            : null;

                                        return (
                                            <tr key={trade.id} className="hover:bg-base-300/30">
                                                <td>
                                                    <span className={`badge ${trade.type === 'BUY' ? 'badge-success' : 'badge-error'}`}>
                                                        {trade.type}
                                                    </span>
                                                </td>
                                                <td className="font-bold">{trade.volume}</td>
                                                <td>
                                                    <span className={`badge ${trade.status === 'open' ? 'badge-info' : 'badge-success'}`}>
                                                        {trade.status === 'open' ? 'Abierto' : 'Cerrado'}
                                                    </span>
                                                </td>
                                                <td>{new Date(trade.open_time).toLocaleDateString('es-ES')}</td>
                                                <td>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-success">●</span>
                                                        <span className="font-mono font-bold text-base-content">
                                                            {formatPrice(openPrice)}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="flex items-center gap-2">
                                                        {isClosed && hasClosePrice ? (
                                                            <>
                                                                <span className={`${difference !== null && difference >= 0 ? 'text-success' : 'text-error'}`}>
                                                                    {difference !== null && difference >= 0 ? '▲' : '▼'}
                                                                </span>
                                                                <span className={`font-mono font-bold ${difference !== null && difference >= 0 ? 'text-success' : 'text-error'}`}>
                                                                    {formatPrice(closePrice)}
                                                                </span>
                                                            </>
                                                        ) : (
                                                            <span className="text-base-content/50 font-medium">-</span>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Paginación */}
                        <div className="flex justify-between items-center p-4 border-t border-base-300/30">
                            <div className="text-sm text-base-content/70">
                                Página {page} de {totalPages} — Mostrando {paginatedTrades.length} trades
                            </div>
                            <div className="join">
                                <button disabled={page === 1} onClick={() => setPage(page - 1)} className="join-item btn btn-sm">«</button>
                                <button className="join-item btn btn-sm bg-primary/20 border-primary/50 text-primary">{page}</button>
                                <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="join-item btn btn-sm">»</button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-8 text-base-content/70">
                        <TrendingUp className="h-12 w-12 mx-auto mb-4 text-base-content/20" />
                        <p>No hay trades registrados para esta cuenta</p>
                        <button className="btn btn-outline btn-sm mt-4">
                            <Plus className="h-4 w-4 mr-2" /> Crear Primer Trade
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}