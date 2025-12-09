'use client';

import Link from 'next/link';
import RuleCard from './RuleCard';
import { Shield, Plus } from 'lucide-react';
import { RiskRule } from '@/types/types';

interface RulesGridProps {
    rules: RiskRule[];
    onToggleRule?: (ruleId: number) => void;
    onEditRule?: (rule: RiskRule) => void;
    onRemoveRule?: (rule: RiskRule) => void;

}

export default function RulesGrid({ rules, onToggleRule, onEditRule, onRemoveRule }: RulesGridProps) {
    if (rules.length === 0) {
        return (
            <div className="text-center py-12">
                <Shield className="h-16 w-16 mx-auto text-base-content/20 mb-4" />
                <h3 className="text-lg font-semibold text-base-content mb-2">
                    No hay reglas configuradas
                </h3>
                <p className="text-base-content/70 mb-6">
                    Crea tu primera regla para comenzar a monitorear el riesgo
                </p>
                <Link href="/rules/new" className="btn btn-primary text-primary border-0">
                    <Plus className="h-5 w-5 mr-2" />
                    Crear Primera Regla
                </Link>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rules.map((rule) => (
                <RuleCard
                    key={rule.id}
                    rule={rule}
                    onToggle={() => onToggleRule?.(rule.id)}
                    onEdit={() => onEditRule?.(rule)}
                    onRemove={() => onRemoveRule?.(rule)}
                />
            ))}
        </div>
    );
}