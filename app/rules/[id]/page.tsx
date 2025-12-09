'use client';

import { useParams, useRouter } from 'next/navigation';
import { useRiskRule } from '@/hooks/useRiskRules';
import RuleDetail from '@/components/riskRules/RiskRuleDetail';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { queryClient } from '@/lib/react-query';

export default function RuleDetailPage() {
    const params = useParams();
    const router = useRouter();
    const ruleId = parseInt(params.id as string);

    const { data, isLoading, error } = useRiskRule(ruleId);

    const handleRuleUpdate = () => {
        queryClient.invalidateQueries({ queryKey: ["risk-rule", ruleId] });
    };


    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="loading loading-spinner loading-lg text-primary"></div>
                    <p className="mt-4 text-base-content/70">Cargando regla...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <div className="mb-6">
                    <Link href="/rules" className="btn btn-ghost btn-sm mb-4 hover:bg-base-300">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Volver a Reglas
                    </Link>
                </div>

                <div className="card bg-base-200 border border-error/20 shadow-2xl">
                    <div className="card-body">
                        <div className="flex items-center gap-3 mb-4">
                            <AlertTriangle className="h-6 w-6 text-error" />
                            <h3 className="text-lg font-semibold text-error">Error al cargar la regla</h3>
                        </div>
                        <p className="text-base-content/70 mb-4">
                            {(error as Error).message || `No se pudo cargar la regla con ID ${ruleId}`}
                        </p>
                        <div className="card-actions">
                            <button
                                className="btn btn-ghost"
                                onClick={() => router.push('/rules')}
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Volver a Reglas
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const rule = data;

    if (!rule) {
        return (
            <div>
                <div className="mb-6">
                    <Link href="/rules" className="btn btn-ghost btn-sm mb-4 hover:bg-base-300">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Volver a Reglas
                    </Link>
                </div>

                <div className="card bg-base-200 border border-warning/20 shadow-2xl">
                    <div className="card-body">
                        <div className="flex items-center gap-3 mb-4">
                            <AlertTriangle className="h-6 w-6 text-warning" />
                            <h3 className="text-lg font-semibold text-warning">Regla no encontrada</h3>
                        </div>
                        <p className="text-base-content/70 mb-4">
                            La regla con ID {ruleId} no existe.
                        </p>
                        <button
                            className="btn btn-ghost"
                            onClick={() => router.push('/rules')}
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Volver a Reglas
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/rules" className="btn btn-ghost btn-sm hover:bg-base-300">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Volver a Reglas
                        </Link>
                        <div className="hidden md:block">
                            <div className="text-sm breadcrumbs">
                                <ul>
                                    <li><Link href="/rules">Reglas</Link></li>
                                    <li><Link href={`/rules/${rule.id}`}>{rule.name}</Link></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <RuleDetail rule={rule} onUpdate={handleRuleUpdate} />
        </div>
    );
}