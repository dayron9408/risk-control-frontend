'use client';

import { useState, useEffect } from 'react';
import { useCreateRiskRule, useUpdateRiskRule } from '@/hooks/useRiskRules';
import { Save, X, AlertTriangle, Timer, BarChart3, TrendingUp, Zap, Info, Plus } from 'lucide-react';
import { RiskRule, RiskRuleSubmission, RiskRuleType, Severity } from '@/types/types';

interface RiskRuleModalProps {
    isOpen: boolean;
    onClose: () => void;
    rule?: RiskRule;
    onSuccess?: () => void;
}

export default function RiskRuleModal({ isOpen, onClose, rule, onSuccess }: RiskRuleModalProps) {
    const createMutation = useCreateRiskRule();
    const updateMutation = useUpdateRiskRule();

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        type: 'DURATION' as RiskRuleType,
        severity: 'SOFT' as Severity,
        is_active: true,
        incidents_before_action: 3,
        // Parámetros específicos
        min_duration_seconds: 60,
        min_factor: 0.5,
        max_factor: 2.0,
        lookback_trades: 10,
        time_window_minutes: 60,
        max_open_trades: 10,
        min_open_trades: null as number | null,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});


    useEffect(() => {
        if (isOpen) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setFormData({
                name: rule?.name || '',
                description: rule?.description || '',
                type: rule?.type || 'DURATION',
                severity: rule?.severity || 'SOFT',
                is_active: rule?.is_active ?? true,
                incidents_before_action: rule?.incidents_before_action || 3,
                min_duration_seconds: rule?.min_duration_seconds || 60,
                min_factor: rule?.min_factor || 0.5,
                max_factor: rule?.max_factor || 2.0,
                lookback_trades: rule?.lookback_trades || 10,
                time_window_minutes: rule?.time_window_minutes || 60,
                max_open_trades: rule?.max_open_trades || 10,
                min_open_trades: rule?.min_open_trades || null,
            });
            setErrors({});
        }
    }, [isOpen, rule]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        // Validaciones básicas
        if (!formData.name.trim()) {
            setErrors({ name: 'El nombre es requerido' });
            return;
        }

        // Validaciones por tipo
        if (formData.type === 'DURATION' && (!formData.min_duration_seconds || formData.min_duration_seconds <= 0)) {
            setErrors({ min_duration_seconds: 'La duración mínima debe ser mayor a 0' });
            return;
        }

        if (formData.type === 'VOLUME') {
            if (!formData.min_factor || formData.min_factor <= 0) {
                setErrors({ min_factor: 'El factor mínimo debe ser mayor a 0' });
                return;
            }
            if (!formData.max_factor || formData.max_factor <= 0) {
                setErrors({ max_factor: 'El factor máximo debe ser mayor a 0' });
                return;
            }
            if (formData.min_factor >= formData.max_factor) {
                setErrors({ max_factor: 'El factor máximo debe ser mayor al mínimo' });
                return;
            }
            if (!formData.lookback_trades || formData.lookback_trades <= 0) {
                setErrors({ lookback_trades: 'Debe considerar al menos 1 trade histórico' });
                return;
            }
        }

        if (formData.type === 'OPEN_TRADES') {
            if (!formData.time_window_minutes || formData.time_window_minutes <= 0) {
                setErrors({ time_window_minutes: 'La ventana de tiempo debe ser mayor a 0' });
                return;
            }
            if (formData.max_open_trades && formData.max_open_trades <= 0) {
                setErrors({ max_open_trades: 'El máximo de trades debe ser mayor a 0' });
                return;
            }
            if (formData.min_open_trades && formData.min_open_trades < 0) {
                setErrors({ min_open_trades: 'El mínimo de trades no puede ser negativo' });
                return;
            }
            if (formData.min_open_trades && formData.max_open_trades && formData.min_open_trades >= formData.max_open_trades) {
                setErrors({ min_open_trades: 'El mínimo debe ser menor al máximo' });
                return;
            }
        }

        // Preparar datos según el tipo
        const submitData: RiskRuleSubmission = {
            name: formData.name,
            description: formData.description,
            type: formData.type,
            severity: formData.severity,
            is_active: formData.is_active,
        };

        // Añadir parámetros según el tipo
        if (formData.type === 'DURATION') {
            submitData.min_duration_seconds = formData.min_duration_seconds;
        } else if (formData.type === 'VOLUME') {
            submitData.min_factor = formData.min_factor;
            submitData.max_factor = formData.max_factor;
            submitData.lookback_trades = formData.lookback_trades;
        } else if (formData.type === 'OPEN_TRADES') {
            submitData.time_window_minutes = formData.time_window_minutes;
            submitData.max_open_trades = formData.max_open_trades;
            if (formData.min_open_trades) {
                submitData.min_open_trades = formData.min_open_trades;
            }
        }

        if (formData.severity === 'SOFT') {
            submitData.incidents_before_action = formData.incidents_before_action;
        }

        if (rule) {
            // For update
            updateMutation.mutate({
                id: rule.id,
                data: submitData
            }, {
                onSuccess: () => {
                    onClose();
                    if (onSuccess) onSuccess();
                },
                onError: () => {
                    setErrors({ general: 'Error al actualizar la regla. Intenta nuevamente.' });
                }
            });
        } else {
            // For create
            createMutation.mutate(submitData, {
                onSuccess: () => {
                    onClose();
                    if (onSuccess) onSuccess();
                },
                onError: () => {
                    setErrors({ general: 'Error al crear la regla. Intenta nuevamente.' });
                }
            });
        }
    };

    // Renderizar campos específicos según el tipo
    const renderTypeSpecificFields = () => {
        switch (formData.type) {
            case 'DURATION':
                return (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold">Duración mínima (segundos) *</span>
                                </label>
                                <input
                                    type="number"
                                    className={`mt-2 input input-bordered ${errors.min_duration_seconds ? 'input-error' : ''}`}
                                    value={formData.min_duration_seconds}
                                    onChange={(e) => setFormData({ ...formData, min_duration_seconds: parseInt(e.target.value) || 0 })}
                                    min="1"
                                    required
                                />
                                {errors.min_duration_seconds && (
                                    <span className="label-text-alt text-error mt-1">{errors.min_duration_seconds}</span>
                                )}
                                <div className="text-sm text-base-content/60 mt-2">
                                    Un trade que dure menos de este tiempo generará una incidencia
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'VOLUME':
                return (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold">Factor mínimo *</span>
                                </label>
                                <input
                                    type="number"
                                    step="0.1"
                                    className={`input input-bordered ${errors.min_factor ? 'input-error' : ''}`}
                                    value={formData.min_factor}
                                    onChange={(e) => setFormData({ ...formData, min_factor: parseFloat(e.target.value) || 0 })}
                                    required
                                />
                                {errors.min_factor && (
                                    <span className="label-text-alt text-error mt-1">{errors.min_factor}</span>
                                )}
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold">Factor máximo *</span>
                                </label>
                                <input
                                    type="number"
                                    step="0.1"
                                    className={`input input-bordered ${errors.max_factor ? 'input-error' : ''}`}
                                    value={formData.max_factor}
                                    onChange={(e) => setFormData({ ...formData, max_factor: parseFloat(e.target.value) || 0 })}
                                    required
                                />
                                {errors.max_factor && (
                                    <span className="label-text-alt text-error mt-1">{errors.max_factor}</span>
                                )}
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold">Trades históricos *</span>
                                </label>
                                <input
                                    type="number"
                                    className={`input input-bordered ${errors.lookback_trades ? 'input-error' : ''}`}
                                    value={formData.lookback_trades}
                                    onChange={(e) => setFormData({ ...formData, lookback_trades: parseInt(e.target.value) || 0 })}
                                    min="1"
                                    required
                                />
                                {errors.lookback_trades && (
                                    <span className="label-text-alt text-error mt-1">{errors.lookback_trades}</span>
                                )}
                            </div>
                        </div>

                        <div className="alert alert-info bg-info/10 text-info border-info/30">
                            <Info className="h-5 w-5 text-info" />
                            <div className="text-sm">
                                <span className="font-medium">¿Cómo funciona?</span>
                                <p className="mt-1">
                                    Se compara el volumen del trade actual con el promedio de los últimos {formData.lookback_trades} trades.
                                    Si está fuera del rango {formData.min_factor}x - {formData.max_factor}x del promedio, se genera incidencia.
                                </p>
                            </div>
                        </div>
                    </div>
                );

            case 'OPEN_TRADES':
                return (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold">Ventana de tiempo (min) *</span>
                                </label>
                                <input
                                    type="number"
                                    className={`input input-bordered ${errors.time_window_minutes ? 'input-error' : ''}`}
                                    value={formData.time_window_minutes}
                                    onChange={(e) => setFormData({ ...formData, time_window_minutes: parseInt(e.target.value) || 0 })}
                                    min="1"
                                    required
                                />
                                {errors.time_window_minutes && (
                                    <span className="label-text-alt text-error mt-1">{errors.time_window_minutes}</span>
                                )}
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold">Trades máximos</span>
                                </label>
                                <input
                                    type="number"
                                    className={`input input-bordered ${errors.max_open_trades ? 'input-error' : ''}`}
                                    value={formData.max_open_trades || ''}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        max_open_trades: e.target.value ? parseInt(e.target.value) : 10
                                    })}
                                    min="1"
                                    placeholder="Sin límite"
                                />
                                {errors.max_open_trades && (
                                    <span className="label-text-alt text-error mt-1">{errors.max_open_trades}</span>
                                )}
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold">Trades mínimos</span>
                                </label>
                                <input
                                    type="number"
                                    className={`input input-bordered ${errors.min_open_trades ? 'input-error' : ''}`}
                                    value={formData.min_open_trades || ''}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        min_open_trades: e.target.value ? parseInt(e.target.value) : null
                                    })}
                                    min="0"
                                    placeholder="Sin límite"
                                />
                                {errors.min_open_trades && (
                                    <span className="label-text-alt text-error mt-1">{errors.min_open_trades}</span>
                                )}
                            </div>
                        </div>

                        <div className="alert alert-info bg-info/10 text-info border-info/30">
                            <Info className="h-5 w-5 text-info" />
                            <div className="text-sm">
                                <span className="font-medium">¿Cómo funciona?</span>
                                <p className="mt-1">
                                    Se cuentan los trades abiertos en los últimos {formData.time_window_minutes} minutos.
                                    Si el conteo excede {formData.max_open_trades || '∞'} o es menor a {formData.min_open_trades || '0'},
                                    se genera una incidencia.
                                </p>
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    const isLoading = createMutation.isPending || updateMutation.isPending;

    if (!isOpen) return null;


    return (
        <>
            {/* Backdrop */}
            <div className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose} />

            {/* Modal */}
            <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                <div
                    className="bg-base-100 border border-primary/20 shadow-2xl rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Header - Fijo */}
                    <div className="flex-shrink-0 bg-base-100 border-b border-base-300 p-6 rounded-t-2xl">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    {rule ? (
                                        <Save className="h-6 w-6 text-primary" />
                                    ) : (
                                        <Plus className="h-6 w-6 text-primary" />
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-base-content">
                                        {rule ? 'Editar Regla' : 'Nueva Regla de Riesgo'}
                                    </h3>
                                    <p className="text-base-content/60">
                                        {rule
                                            ? 'Modifica los parámetros de la regla existente'
                                            : 'Configura una nueva regla para el sistema de control'
                                        }
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="btn btn-ghost btn-circle hover:bg-base-300"
                                disabled={isLoading}
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {errors.general && (
                            <div className="alert alert-error bg-error/20 border-error/30 mt-3">
                                <AlertTriangle className="h-5 w-5 text-error" />
                                <span className="text-error">{errors.general}</span>
                            </div>
                        )}
                    </div>

                    {/* Contenido del Formulario - Con scroll */}
                    <div className="flex-1 overflow-y-auto p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Sección 1: Información Básica */}
                            <div className="card bg-base-200 border-base-300">
                                <div className="card-body p-6">
                                    <h4 className="card-title text-base-content mb-4">
                                        <Info className="h-5 w-5 text-primary mr-2" />
                                        Información Básica
                                    </h4>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text font-semibold">Nombre *</span>
                                            </label>
                                            <input
                                                type="text"
                                                className={` mt-2 input input-bordered ${errors.name ? 'input-error' : ''}`}
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                placeholder="Ej: Control de trades cortos"
                                                required
                                            />
                                            {errors.name && (
                                                <span className="label-text-alt text-error mt-1">{errors.name}</span>
                                            )}
                                        </div>

                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text font-semibold">Tipo de Regla *</span>
                                            </label>
                                            <select
                                                className="mt-2 select select-bordered"
                                                value={formData.type}
                                                onChange={(e) => setFormData({ ...formData, type: e.target.value as RiskRuleType })}
                                            >
                                                <option value="DURATION">Duración de Trade</option>
                                                <option value="VOLUME">Consistencia de Volumen</option>
                                                <option value="OPEN_TRADES">Trades Abiertos</option>
                                            </select>
                                        </div>

                                        <div className="form-control mt-4">
                                            <label className="label">
                                                <span className="label-text font-semibold">Descripción</span>
                                            </label>
                                            <textarea
                                                className="mt-2 textarea textarea-bordered"
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                placeholder="Describe el propósito y funcionamiento de esta regla..."
                                                rows={3}
                                            />
                                        </div>
                                    </div>


                                </div>
                            </div>

                            {/* Sección 2: Severidad y Acciones */}
                            <div className="card bg-base-200 border-base-300">
                                <div className="card-body p-6">
                                    <h4 className="card-title text-base-content mb-4">
                                        <AlertTriangle className="h-5 w-5 text-warning mr-2" />
                                        Configuración de Severidad
                                    </h4>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <div className="font-medium mb-3">Tipo de Severidad *</div>
                                            <div className="space-y-3">
                                                <label className="flex items-center gap-3 p-3 bg-base-300/30 rounded-lg cursor-pointer hover:bg-base-300/50">
                                                    <input
                                                        type="radio"
                                                        name="severity"
                                                        className="radio radio-warning"
                                                        value="SOFT"
                                                        checked={formData.severity === 'SOFT'}
                                                        onChange={(e) => setFormData({ ...formData, severity: e.target.value as Severity })}
                                                    />
                                                    <div>
                                                        <div className="font-medium flex items-center gap-2">
                                                            <AlertTriangle className="h-4 w-4 text-warning" />
                                                            Regla Suave
                                                        </div>
                                                        <div className="text-sm text-base-content/60 mt-1">
                                                            Acumula incidencias antes de ejecutar acciones
                                                        </div>
                                                    </div>
                                                </label>

                                                <label className="flex items-center gap-3 p-3 bg-base-300/30 rounded-lg cursor-pointer hover:bg-base-300/50">
                                                    <input
                                                        type="radio"
                                                        name="severity"
                                                        className="radio radio-error"
                                                        value="HARD"
                                                        checked={formData.severity === 'HARD'}
                                                        onChange={(e) => setFormData({ ...formData, severity: e.target.value as Severity })}
                                                    />
                                                    <div>
                                                        <div className="font-medium flex items-center gap-2">
                                                            <AlertTriangle className="h-4 w-4 text-error" />
                                                            Regla Dura
                                                        </div>
                                                        <div className="text-sm text-base-content/60 mt-1">
                                                            Ejecuta acciones inmediatamente
                                                        </div>
                                                    </div>
                                                </label>
                                            </div>
                                        </div>

                                        {formData.severity === 'SOFT' && (
                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text font-semibold">Incidentes antes de acción *</span>
                                                </label>
                                                <input
                                                    type="number"
                                                    className="mt-4 input input-bordered"
                                                    value={formData.incidents_before_action}
                                                    onChange={(e) => setFormData({ ...formData, incidents_before_action: parseInt(e.target.value) || 1 })}
                                                    min="1"
                                                    required
                                                />
                                                <div className="text-sm text-base-content/60 mt-2">
                                                    Número de violaciones que se permiten antes de ejecutar acciones
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Sección 3: Parámetros Específicos */}
                            <div className="card bg-base-200 border-base-300">
                                <div className="card-body p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-primary/10 rounded">
                                            {formData.type === 'DURATION' ? (
                                                <Timer className="h-5 w-5 text-primary" />
                                            ) : formData.type === 'VOLUME' ? (
                                                <BarChart3 className="h-5 w-5 text-primary" />
                                            ) : (
                                                <TrendingUp className="h-5 w-5 text-primary" />
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-semibold text-base-content">
                                                Parámetros de {formData.type === 'DURATION' ? 'Duración' : formData.type === 'VOLUME' ? 'Volumen' : 'Trades Abiertos'}
                                            </h4>
                                            <p className="text-sm text-base-content/60">
                                                Configura los umbrales específicos para esta regla
                                            </p>
                                        </div>
                                    </div>

                                    {renderTypeSpecificFields()}
                                </div>
                            </div>

                            {/* Sección 4: Estado */}
                            <div className="card bg-base-200 border-base-300">
                                <div className="card-body p-6">
                                    <label className="flex items-center justify-between cursor-pointer">
                                        <div className="flex items-center gap-3">
                                            <Zap className="h-5 w-5 text-primary" />
                                            <div>
                                                <div className="font-semibold text-base-content">
                                                    {formData.is_active ? 'Regla Activa' : 'Regla Inactiva'}
                                                </div>
                                                <div className="text-sm text-base-content/60">
                                                    {formData.is_active
                                                        ? 'La regla se evaluará en tiempo real'
                                                        : 'La regla estará desactivada y no generará incidencias'
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        <input
                                            type="checkbox"
                                            className="toggle toggle-primary"
                                            checked={formData.is_active}
                                            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                        />
                                    </label>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Footer */}
                    <div className="flex-shrink-0 border-t border-base-300 p-6 bg-base-100 rounded-b-2xl">
                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                className="btn btn-ghost"
                                onClick={onClose}
                                disabled={isLoading}
                            >
                                <X className="h-4 w-4 mr-2" />
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                onClick={handleSubmit}
                                className="btn btn-primary"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <span className="loading loading-spinner loading-sm"></span>
                                        {rule ? 'Actualizando...' : 'Creando...'}
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-4 w-4 mr-2" />
                                        {rule ? 'Actualizar Regla' : 'Crear Regla'}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}