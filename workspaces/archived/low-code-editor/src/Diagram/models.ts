export const TRIGGER_TYPE_WEBHOOK = "Webhook";
export const TRIGGER_TYPE_API = "API";
export const TRIGGER_TYPE_MANUAL = "Manual";
export const TRIGGER_TYPE_SCHEDULE = "Schedule";
export const TRIGGER_TYPE_EMAIL = "Email";
export const TRIGGER_TYPE_SERVICE_DRAFT = "Service Draft";
export const TRIGGER_TYPE_INTEGRATION_DRAFT = "Integration Draft";

export const TRIGGER_TYPES = [TRIGGER_TYPE_WEBHOOK, TRIGGER_TYPE_API,
    TRIGGER_TYPE_MANUAL, TRIGGER_TYPE_SCHEDULE, TRIGGER_TYPE_EMAIL];

export type TriggerType = typeof TRIGGER_TYPE_WEBHOOK
    | typeof TRIGGER_TYPE_API
    | typeof TRIGGER_TYPE_MANUAL
    | typeof TRIGGER_TYPE_SCHEDULE
    | typeof TRIGGER_TYPE_EMAIL
    | typeof TRIGGER_TYPE_SERVICE_DRAFT
    | typeof TRIGGER_TYPE_INTEGRATION_DRAFT;

export const HTTP_GET = "GET";
export const HTTP_POST = "POST";
export const HTTP_PUT = "PUT";
export const HTTP_DELETE = "DELETE";
export const HTTP_OPTIONS = "OPTIONS";
export const HTTP_HEAD = "HEAD";
export const HTTP_PATCH = "PATCH";

export const SERVICE_METHODS = [HTTP_GET, HTTP_PUT, HTTP_DELETE, HTTP_POST, HTTP_PATCH];
export const WEBHOOK_METHODS = [HTTP_GET, HTTP_POST];

export type ServiceMethodType = typeof HTTP_GET | typeof HTTP_PUT | typeof HTTP_DELETE | typeof HTTP_POST | typeof HTTP_OPTIONS | typeof HTTP_HEAD | typeof HTTP_PATCH;
export interface ServiceTriggerConfig {
    serviceName: string;
    resourceName: string;
    method: ServiceMethodType;
    port: number;
}

export type WebhookMethodType = typeof HTTP_GET | typeof HTTP_POST;

export interface WebhookTriggerConfig extends ServiceTriggerConfig {
    method: WebhookMethodType;
}

export interface ScheduleTriggerConfig {
    cron: string;
}
