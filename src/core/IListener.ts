
export interface IListener {
    listen: (action: string, changedItems: any[]) => void;
}