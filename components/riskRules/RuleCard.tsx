'use client';

import Link from 'next/link';
import {
    MoreVertical,
    Edit,
    Trash2,
    Eye as EyeIcon,
    Timer,
    BarChart3,
    TrendingUp,
    Shield,
} from 'lucide-react';
import { RiskRule } from '@/types/types';

interface RuleCardProps {
    rule: RiskRule;
    onToggle?: () => void;
    onEdit?: () => void;
    onRemove?: () => void;
}

export default function RuleCard({ rule, onToggle, onEdit, onRemove }: RuleCardProps) {

    const getRuleTypeIcon = (type: string) => {
        switch (type) {
            case 'DURATION': return <Timer className="h-5 w-5" />;
            case 'VOLUME': return <BarChart3 className="h-5 w-5" />;
            case 'OPEN_TRADES': return <TrendingUp className="h-5 w-5" />;
            default: return <Shield className="h-5 w-5" />;
        }
    };

    const getRuleTypeText = (type: string) => {
        switch (type) {
            case 'DURATION': return 'Duración';
            case 'VOLUME': return 'Volumen';
            case 'OPEN_TRADES': return 'Trades Abiertos';
            default: return type;
        }
    };

    const getRuleTypeColor = (type: string) => {
        switch (type) {
            case 'DURATION': return 'border-info/30 bg-info/10 text-info';
            case 'VOLUME': return 'border-warning/30 bg-warning/10 text-warning';
            case 'OPEN_TRADES': return 'border-error/30 bg-error/10 text-error';
            default: return 'border-primary/30 bg-primary/10 text-primary';
        }
    };

    const getSeverityColor = (severity: string) => {
        return severity === 'HARD'
            ? 'border-error/30 bg-error/10 text-error'
            : 'border-warning/30 bg-warning/10 text-warning';
    };

    const handleToggle = () => {
        if (onToggle) {
            onToggle();
        }
    };

    const handleEdit = (e: React.MouseEvent) => {
        e.preventDefault();
        if (onEdit) {
            onEdit();
        }
    };

    const handleDelete = async () => {
        if (onRemove) {
            onRemove();
        }
    };

    return (
        <div className="card bg-base-200 border border-primary/20 shadow-xl hover:shadow-2xl hover:border-primary/40 transition-all duration-300 group">
            <div className="card-body p-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="card-title text-base-content group-hover:text-primary transition-colors">
                            {rule.name}
                        </h3>
                        <div className="flex gap-2 mt-3">
                            <span className={`badge border ${getSeverityColor(rule.severity)}`}>
                                {rule.severity === 'HARD' ? 'Dura' : 'Suave'}
                            </span>
                            <span className={`badge border ${rule.is_active ? 'border-success/30 bg-success/10 text-success' : 'border-base-content/30 bg-base-content/10 text-base-content/70'}`}>
                                {rule.is_active ? 'Activa' : 'Inactiva'}
                            </span>
                        </div>
                    </div>
                    <div className="dropdown dropdown-end">
                        <label tabIndex={0} className="btn btn-ghost btn-sm hover:bg-base-300">
                            <MoreVertical className="h-4 w-4" />
                        </label>
                        <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow-2xl bg-base-200 rounded-box w-52 border border-primary/20">
                            <li>
                                <Link href={`/rules/${rule.id}`} className="text-base-content hover:bg-primary/20 hover:text-primary">
                                    <EyeIcon className="h-4 w-4" /> Ver Detalles
                                </Link>
                            </li>
                            <li>
                                <button onClick={handleEdit} className="text-base-content hover:bg-primary/20 hover:text-primary">
                                    <Edit className="h-4 w-4" /> Editar
                                </button>
                            </li>
                            <li>
                                <button onClick={handleDelete} className="text-error hover:bg-error/20 hover:text-error">
                                    <Trash2 className="h-4 w-4" /> Eliminar
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>

                <p className="text-base-content/80 text-sm mb-6 line-clamp-2">
                    {rule.description || 'Sin descripción disponible'}
                </p>

                <div className="card-actions justify-between items-center border-t border-base-300/30 pt-4">
                    <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-lg ${getRuleTypeColor(rule.type)}`}>
                            {getRuleTypeIcon(rule.type)}
                        </div>
                        <div>
                            <div className="text-sm font-medium text-base-content">{getRuleTypeText(rule.type)}</div>
                            <div className="text-xs text-base-content/60">
                                {rule.severity === 'SOFT' && rule.incidents_before_action && (
                                    <>Acción tras {rule.incidents_before_action} violaciones</>
                                )}
                                {rule.severity === 'HARD' && (
                                    <>Acción inmediata</>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="text-sm text-base-content/70">{rule.is_active ? 'Activa' : 'Inactiva'}</span>
                        <button
                            onClick={handleToggle}
                            className="relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                            style={{
                                backgroundColor: rule.is_active ? 'oklch(var(--p) / 0.5)' : 'oklch(var(--bc) / 0.2)'
                            }}
                        >
                            <span
                                className={`inline-block w-5 h-5 transform rounded-full bg-white transition-transform duration-200 ease-in-out ${rule.is_active ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                            />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}