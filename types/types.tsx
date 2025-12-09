// Tipos completos según nuestros modelos Laravel
export interface Account {
    id: number;
    login: number;
    trading_status: "enable" | "disable";
    status: "enable" | "disable";
    created_at: string;
    updated_at: string;
    deleted_at?: string;
}

export interface AccountDetails {
    id: number;
    login: number;
    trading_status: "enable" | "disable";
    status: "enable" | "disable";
    created_at: string;
    updated_at: string;
    deleted_at?: string;
    incidents: Incident[];
    trades: Trade[];
}

export interface Trade {
    id: number;
    account_id: number;
    type: "BUY" | "SELL";
    volume: number;
    open_time: string;
    close_time: string | null;
    open_price: number;
    close_price: number | null;
    status: "open" | "closed";
    created_at: string;
    updated_at: string;
}

export interface RiskRule {
    id: number;
    name: string;
    description: string | null;
    type: RiskRuleType;
    severity: Severity;
    min_duration_seconds: number | null;
    min_factor: number | null;
    max_factor: number | null;
    lookback_trades: number | null;
    time_window_minutes: number | null;
    min_open_trades: number | null;
    max_open_trades: number | null;
    incidents_before_action: number | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    actions: RuleAction[];
    incidents: Incident[];
}

export type EmailConfig = { email_to: string; subject: string };
export type SlackConfig = { channel: string; webhook_url: string };
export type DisableAccountConfig = { reason: string };
export type DisableTradingConfig = { reason: string };

export type ActionConfig = EmailConfig | SlackConfig | DisableAccountConfig | DisableTradingConfig | null;

export interface RuleAction {
    id: number;
    rule_id: number;
    action_type: ActionType;
    config:
    | EmailConfig
    | SlackConfig
    | DisableAccountConfig
    | DisableTradingConfig
    | null;
    order: number;
    created_at: string;
    updated_at: string;
}

export interface Incident {
    id: number;
    rule: RiskRule;
    account: Account;
    trade: Trade
    severity: Severity;
    description: string;
    created_at: string;
    updated_at: string;
}

export interface Notifications {
    id: number;
    incident_id: number;
    action_type: string;
    status: "PENDING" | "EXECUTED" | "FAILED";
    details: string | null;
    metadata: string | null;
    executed_at: string | null;
    created_at: string;
    updated_at: string;
}

// Response types
export interface PaginatedResponse<T> {
    current_page: number;
    data: T[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}

export interface RiskData {
    account_id: number;
    login: number;
    status: 'enable' | 'disable';
    trading_status: 'enable' | 'disable';
    incidents_by_severity: {
        HARD: number;
        SOFT: number;
    };
    open_trades_count: number;
    closed_trades_count: number;
    risk_level: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface IncidentResponse {
    time_range: string;
    total: number;
    by_severity: {
        HARD?: number;
        SOFT?: number;
    };
    top_rules: { name: string; type: string; count: number }[];
}

export type RiskRuleSubmission = {
    name: string;
    description: string;
    type: RiskRuleType;
    severity: Severity;
    is_active: boolean;
    incidents_before_action?: number;
    min_duration_seconds?: number;
    min_factor?: number;
    max_factor?: number;
    lookback_trades?: number;
    time_window_minutes?: number;
    max_open_trades?: number;
    min_open_trades?: number | null;
};

// Catálogo de severidades
export type Severity = "HARD" | "SOFT";

// Catálogo de tipos de acción
export type ActionType =
    | "EMAIL"
    | "SLACK"
    | "DISABLE_ACCOUNT"
    | "DISABLE_TRADING";

// Catálogo de tipos de regla
export type RiskRuleType = "DURATION" | "VOLUME" | "OPEN_TRADES";

// Info asociada a cada tipo
export interface RiskRuleTypeInfo {
    label: string;
    description?: string;
}

export interface RiskRuleConfigResponse {
    types: RiskRuleType[];
    types_info: Record<RiskRuleType, RiskRuleTypeInfo>;
    severities: Severity[];
    action_types: ActionType[];
}

export type QueryParams = Record<string, string | number | boolean | undefined>;
export interface ApiResponse<T> {
    message?: string;
    data: T;
}