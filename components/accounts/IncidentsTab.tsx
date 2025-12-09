// components/accounts/IncidentsTab.tsx
'use client';

import { Incident } from '@/types/types';
import { AlertTriangle, CheckCircle } from 'lucide-react';

interface IncidentsTabProps {
    incidents: Incident[];
}

export default function IncidentsTab({ incidents }: IncidentsTabProps) {
    return (
        <div className="card bg-base-200 border border-primary/20 shadow-2xl">
            <div className="card-body">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-base-content">
                        <AlertTriangle className="h-5 w-5 inline mr-2" />
                        Incidentes
                    </h3>
                </div>

                {incidents.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Severidad</th>
                                    <th>Descripción</th>
                                    <th>Fecha</th>
                                </tr>
                            </thead>
                            <tbody>
                                {incidents.map((incident) => (
                                    <tr key={incident.id} className="hover:bg-base-300/30">
                                        <td>
                                            <span className={`badge ${incident.severity === 'HARD' ? 'badge-error' : 'badge-warning'}`}>
                                                {incident.severity}
                                            </span>
                                        </td>
                                        <td className="max-w-[320px] truncate">{incident.description}</td>
                                        <td>{new Date(incident.created_at).toLocaleDateString('es-ES')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-8 text-base-content/70">
                        <CheckCircle className="h-12 w-12 mx-auto mb-4 text-success/50" />
                        <p className="text-success">¡Excelente! No hay incidentes</p>
                    </div>
                )}
            </div>
        </div>
    );
}
