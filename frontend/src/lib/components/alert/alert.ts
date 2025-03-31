import type { Icon } from "$lib/icons/icons";

export const ALERT_DESTROY_TIMER = 5000;

export enum AlertType {
    Normal = "normal",
    Error = "error",
    Warning = "warning",
    Success = "success",
}

export class AlertData {
    id: number;
    alertType: AlertType;
    icon: Icon;
    header: string;
    body: string | null;

    constructor(
        id: number,
        alertType: AlertType,
        icon: Icon,
        header: string,
        body: string | null,
    ) {
        this.id = id;
        (this.alertType = alertType),
            (this.icon = icon),
            (this.header = header),
            (this.body = body);
    }
}
