import {
    ALERT_DESTROY_TIMER,
    AlertData,
    type AlertType,
} from "./components/alert/alert";
import type { Icon } from "./icons/icons";

export class AppState {
    alertId = $state(0);
    alerts: AlertData[] = $state([]);

    public addAlert(
        alertType: AlertType,
        icon: Icon,
        header: string,
        body: string | null = null,
    ) {
        const newId = this.alertId++;
        this.alerts.push(new AlertData(newId, alertType, icon, header, body));

        setTimeout(() => {
            this.removeAlert(newId);
        }, ALERT_DESTROY_TIMER);
    }

    public removeAlert(alertId: number) {
        const idx = this.alerts.findLastIndex(
            (v) => v.id === alertId.valueOf(),
        );
        if (idx !== -1) {
            this.alerts.splice(idx, 1);
        }
    }
}
export const appState = new AppState();

export interface UserState {
    username: string;
}
