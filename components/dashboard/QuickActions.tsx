'use client';

import { Zap, Users, Cpu, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function QuickActions() {
    return (
        <div className="card bg-base-200 border border-primary/20 shadow-2xl">
            <div className="card-body p-6">
                <h2 className="card-title text-base-content mb-4">
                    <Zap className="h-6 w-6 text-warning" />
                    Acciones Rápidas
                </h2>
                <div className="space-y-4">
                    <Link
                        href="/accounts"
                        className="btn btn-outline border-primary/30 hover:bg-primary/20 hover:border-primary/50 w-full justify-start text-base-content hover:text-primary transition-all duration-200 group"
                    >
                        <div className="p-1.5 bg-primary/10 rounded-md mr-3 group-hover:bg-primary/20">
                            <Users className="h-5 w-5" />
                        </div>
                        Gestionar Cuentas
                        <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                            →
                        </div>
                    </Link>

                    <Link
                        href="/rules"
                        className="btn btn-outline border-secondary/30 hover:bg-secondary/20 hover:border-secondary/50 w-full justify-start text-base-content hover:text-secondary transition-all duration-200 group"
                    >
                        <div className="p-1.5 bg-secondary/10 rounded-md mr-3 group-hover:bg-secondary/20">
                            <Cpu className="h-5 w-5" />
                        </div>
                        Configurar Reglas
                        <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                            →
                        </div>
                    </Link>

                    <Link
                        href="/incidents"
                        className="btn btn-outline border-warning/30 hover:bg-warning/20 hover:border-warning/50 w-full justify-start text-base-content hover:text-warning transition-all duration-200 group"
                    >
                        <div className="p-1.5 bg-warning/10 rounded-md mr-3 group-hover:bg-warning/20">
                            <AlertTriangle className="h-5 w-5" />
                        </div>
                        Revisar Incidentes
                        <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                            →
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}