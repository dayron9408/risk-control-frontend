"use client";

import { useState } from "react";
import { riskRuleService } from "@/services/api";
import { Bell, Mail, Lock, Settings, Plus } from "lucide-react";
import { toast } from "react-toastify";
import { ActionConfig, ActionType, DisableAccountConfig, DisableTradingConfig, EmailConfig, RuleAction, SlackConfig } from "@/types/types";

interface ActionsTabProps {
    ruleId: number;
    actions: RuleAction[];
    onActionAdded: () => void;
}

interface ActionFormData {
    action_type: ActionType;
    config: ActionConfig;
    order: number;
}


const isEmailConfig = (config: ActionConfig): config is EmailConfig => {
    return config !== null && 'email_to' in config;
};

const isSlackConfig = (config: ActionConfig): config is SlackConfig => {
    return config !== null && 'channel' in config && 'webhook_url' in config;
};

const isDisableConfig = (config: ActionConfig): config is DisableAccountConfig | DisableTradingConfig => {
    return config !== null && 'reason' in config;
};

export default function ActionsTab({
    ruleId,
    actions,
    onActionAdded,
}: ActionsTabProps) {
    const [showAddForm, setShowAddForm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newAction, setNewAction] = useState<ActionFormData>({
        action_type: "EMAIL",
        config: { email_to: "", subject: "" },
        order: actions.length + 1,
    });

    const getActionIcon = (actionType: ActionType) => {
        switch (actionType) {
            case "EMAIL":
                return <Mail className="h-5 w-5" />;
            case "SLACK":
                return <Bell className="h-5 w-5" />;
            case "DISABLE_ACCOUNT":
                return <Lock className="h-5 w-5" />;
            case "DISABLE_TRADING":
                return <Settings className="h-5 w-5" />;
            default:
                return <Bell className="h-5 w-5" />;
        }
    };

    const getActionText = (actionType: ActionType) => {
        switch (actionType) {
            case "EMAIL":
                return "Enviar Email";
            case "SLACK":
                return "Notificar por Slack";
            case "DISABLE_ACCOUNT":
                return "Deshabilitar Cuenta";
            case "DISABLE_TRADING":
                return "Deshabilitar Trading";
            default:
                return actionType;
        }
    };

    const getActionDescription = (action: RuleAction) => {
        if (!action.config) return "Sin configuración";

        switch (action.action_type) {
            case "EMAIL": {
                const emailConfig = action.config as EmailConfig;
                return `Enviar a: ${emailConfig.email_to || "No especificado"}`;
            }
            case "SLACK": {
                const slackConfig = action.config as SlackConfig;
                return `Canal: ${slackConfig.channel || "No especificado"}`;
            }
            case "DISABLE_ACCOUNT": {
                const disableConfig = action.config as DisableAccountConfig;
                return `Razón: ${disableConfig.reason || "Incumplimiento de regla"}`;
            }
            case "DISABLE_TRADING": {
                const disableConfig = action.config as DisableTradingConfig;
                return `Razón: ${disableConfig.reason || "Incumplimiento de regla"}`;
            }
            default:
                return JSON.stringify(action.config);
        }
    };


    const handleActionTypeChange = (actionType: ActionType) => {
        const defaultConfigs: Record<ActionType, ActionConfig> = {
            EMAIL: { email_to: "", subject: "" },
            SLACK: { channel: "", webhook_url: "" },
            DISABLE_ACCOUNT: { reason: "Incumplimiento de regla" },
            DISABLE_TRADING: { reason: "Incumplimiento de regla" },
        };

        setNewAction({
            ...newAction,
            action_type: actionType,
            config: defaultConfigs[actionType],
        });
    };

    const handleConfigChange = (key: string, value: string) => {
        setNewAction({
            ...newAction,
            config: {
                ...newAction.config,
                [key]: value,
            } as ActionConfig,
        });
    };

    const handleAddAction = async () => {
        if (!newAction.config) {
            toast.info("Por favor, completa la configuración");
            return;
        }

        // Validaciones específicas por tipo usando type guards
        if (isEmailConfig(newAction.config) && !newAction.config.email_to) {
            toast.error("Por favor, ingresa un email válido");
            return;
        }

        if (isSlackConfig(newAction.config) && !newAction.config.channel) {
            toast.error("Por favor, ingresa un canal de Slack");
            return;
        }

        if (isDisableConfig(newAction.config) && !newAction.config.reason) {
            toast.error("Por favor, ingresa una razón");
            return;
        }

        setIsSubmitting(true);
        try {
            await riskRuleService.assignActions(ruleId, [
                ...actions.map((a) => ({
                    action_type: a.action_type,
                    config: a.config,
                    order: a.order,
                })),
                newAction,
            ]);

            setNewAction({
                action_type: "EMAIL",
                config: { email_to: "", subject: "" },
                order: actions.length + 2,
            });
            setShowAddForm(false);
            onActionAdded();
        } catch (error) {
            console.error("Error al agregar acción:", error);
            alert("Error al agregar la acción");
        } finally {
            setIsSubmitting(false);
        }
    };


    const renderConfigInputs = () => {
        switch (newAction.action_type) {
            case "EMAIL":
                const emailConfig = newAction.config as EmailConfig;
                return (
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Email destino</span>
                        </label>
                        <input
                            type="email"
                            className="input input-bordered"
                            placeholder="alerts@example.com"
                            value={emailConfig?.email_to || ""}
                            onChange={(e) => handleConfigChange("email_to", e.target.value)}
                        />
                    </div>
                );
            case "SLACK":
                const slackConfig = newAction.config as SlackConfig;
                return (
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Canal de Slack</span>
                        </label>
                        <input
                            type="text"
                            className="input input-bordered"
                            placeholder="#risk-alerts"
                            value={slackConfig.channel || ""}
                            onChange={(e) => handleConfigChange("channel", e.target.value)}
                        />
                    </div>
                );
            case "DISABLE_ACCOUNT":
            case "DISABLE_TRADING":
                const disableConfig = newAction.config as DisableAccountConfig | DisableTradingConfig;
                return (
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Razón</span>
                        </label>
                        <input
                            type="text"
                            className="input input-bordered"
                            placeholder="Incumplimiento de regla"
                            value={disableConfig.reason || ""}
                            onChange={(e) => handleConfigChange("reason", e.target.value)}
                        />
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="space-y-6">
            {/* Encabezado */}
            <div className="card bg-base-200 border border-primary/20">
                <div className="card-body">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h3 className="card-title text-base-content">
                                <Bell className="h-5 w-5 inline mr-2" />
                                Acciones de la Regla
                            </h3>
                            <p className="text-base-content/70 mt-1">
                                Define las acciones que se ejecutarán cuando se active esta
                                regla
                            </p>
                        </div>
                        <button
                            onClick={() => setShowAddForm(!showAddForm)}
                            className="btn btn-primary gap-2"
                        >
                            <Plus className="h-4 w-4" />
                            Agregar Acción
                        </button>
                    </div>
                </div>
            </div>

            {/* Formulario para agregar nueva acción */}
            {showAddForm && (
                <div className="card bg-base-200 border border-info/20">
                    <div className="card-body">
                        <h4 className="font-semibold text-base-content mb-4">
                            Nueva Acción
                        </h4>

                        <div className="space-y-4">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Tipo de Acción</span>
                                </label>
                                <select
                                    className="select select-bordered w-full"
                                    value={newAction.action_type}
                                    onChange={(e) =>
                                        handleActionTypeChange(e.target.value as ActionType)
                                    }
                                >
                                    <option value="EMAIL">Enviar Email</option>
                                    <option value="SLACK">Notificar por Slack</option>
                                    <option value="DISABLE_ACCOUNT">Deshabilitar Cuenta</option>
                                    <option value="DISABLE_TRADING">Deshabilitar Trading</option>
                                </select>
                            </div>

                            {renderConfigInputs()}

                            <div className="flex justify-end gap-2 pt-4">
                                <button
                                    onClick={() => setShowAddForm(false)}
                                    className="btn btn-ghost"
                                    disabled={isSubmitting}
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleAddAction}
                                    className="btn btn-primary gap-2"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <span className="loading loading-spinner"></span>
                                    ) : (
                                        <Plus className="h-4 w-4" />
                                    )}
                                    Agregar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Lista de acciones */}
            <div className="card bg-base-200 border border-primary/20">
                <div className="card-body p-0">
                    {actions.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="table">
                                <thead>
                                    <tr className="bg-base-300">
                                        <th className="text-base-content/70">Orden</th>
                                        <th className="text-base-content/70">Tipo</th>
                                        <th className="text-base-content/70">Configuración</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {actions
                                        .sort((a, b) => a.order - b.order)
                                        .map((action) => (
                                            <tr key={action.id} className="hover:bg-base-100">
                                                <td>
                                                    <div className="font-mono font-bold">
                                                        {action.order}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="flex items-center gap-2">
                                                        {getActionIcon(action.action_type)}
                                                        <span className="font-medium">
                                                            {getActionText(action.action_type)}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="max-w-md">
                                                        <div className="text-sm text-base-content/70">
                                                            {getActionDescription(action)}
                                                        </div>
                                                        <div className="text-xs text-base-content/50 mt-1">
                                                            Creada:{" "}
                                                            {new Date(action.created_at).toLocaleDateString(
                                                                "es-ES"
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <Bell className="h-16 w-16 mx-auto mb-4 text-base-content/20" />
                            <h4 className="text-lg font-semibold text-base-content mb-2">
                                No hay acciones configuradas
                            </h4>
                            <p className="text-base-content/70 mb-6">
                                Esta regla no ejecutará ninguna acción cuando se active.
                            </p>
                            <button
                                onClick={() => setShowAddForm(true)}
                                className="btn btn-primary gap-2"
                            >
                                <Plus className="h-4 w-4" />
                                Agregar tu primera acción
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Nota informativa */}
            <div className="card bg-base-200 border border-info/20">
                <div className="card-body">
                    <div className="flex items-start gap-3">
                        <Bell className="h-5 w-5 text-info mt-0.5" />
                        <div>
                            <h4 className="font-semibold text-base-content mb-1">
                                Información sobre las acciones
                            </h4>
                            <ul className="text-sm text-base-content/70 space-y-1">
                                <li>
                                    • Las acciones se ejecutan en el orden especificado
                                </li>
                                <li>
                                    • Para reglas SOFT, las acciones solo se ejecutan después de
                                    alcanzar el límite de incidentes
                                </li>
                                <li>
                                    • Las reglas HARD ejecutan acciones inmediatamente al primer
                                    incidente
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}