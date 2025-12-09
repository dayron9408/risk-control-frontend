// components/incidents/IncidentsTable.tsx
'use client';

import { Incident } from '@/types/types';
import { AlertTriangle, Users, FileText, XCircle } from 'lucide-react';

interface IncidentsTableProps {
    incidents: Incident[];
    onViewDetails: (id: number) => void;
    hasActiveFilters: boolean;
    onClearFilters: () => void;
}

export default function IncidentsTable({
    incidents,
    hasActiveFilters,
    onClearFilters
}: IncidentsTableProps) {
    return (
        <div className="overflow-x-auto rounded-xl">
            <table className="table">
                <thead className="bg-base-300/50">
                    <tr>
                        <th className="text-base-content font-semibold">Descripción</th>
                        <th className="text-base-content font-semibold">Severidad</th>
                        <th className="text-base-content font-semibold">Fecha</th>
                    </tr>
                </thead>
                <tbody>
                    {incidents.map((incident) => (
                        <tr key={incident.id} className="hover:bg-base-300/30 transition-colors duration-150">
                            <td>
                                <div className="max-w-md">
                                    <div className="font-medium text-base-content">{incident.description}</div>
                                    <div className="text-xs text-base-content/60 flex items-center gap-2 mt-1">
                                        <Users className="h-3 w-3" />
                                        Cuenta: {incident.account?.login || incident.account.id} •
                                        Regla: {incident.rule?.name || incident.rule.id}
                                        {incident.trade && (
                                            <span className="flex items-center gap-1 ml-2">
                                                <FileText className="h-3 w-3" />
                                                Trade: {incident.trade.type}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div className={`badge badge-sm border ${incident.severity === 'HARD' ? 'border-error/30 bg-error/20 text-error' : 'border-warning/30 bg-warning/20 text-warning'} gap-1`}>
                                    {incident.severity === 'HARD' ? (
                                        <>
                                            <XCircle className="h-3 w-3" />
                                            Dura
                                        </>
                                    ) : (
                                        <>
                                            <AlertTriangle className="h-3 w-3" />
                                            Suave
                                        </>
                                    )}
                                </div>
                            </td>
                            <td>
                                <div className="text-sm">
                                    <div className="text-base-content">
                                        {new Date(incident.created_at).toLocaleDateString('es-ES')}
                                    </div>
                                    <div className="text-xs text-base-content/60">
                                        {new Date(incident.created_at).toLocaleTimeString('es-ES', {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </div>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Empty State */}
            {incidents.length === 0 && (
                <div className="text-center py-12">
                    <AlertTriangle className="h-16 w-16 mx-auto text-base-content/20 mb-4" />
                    <h3 className="text-lg font-semibold text-base-content mb-2">No hay incidentes</h3>
                    <p className="text-base-content/70 mb-6">
                        {hasActiveFilters
                            ? 'No hay incidentes con los filtros aplicados'
                            : 'No se han detectado violaciones de reglas'
                        }
                    </p>
                    <button
                        className="btn btn-outline btn-sm border-base-300 hover:bg-base-300"
                        onClick={onClearFilters}
                    >
                        Limpiar Filtros
                    </button>
                </div>
            )}
        </div>
    );
}