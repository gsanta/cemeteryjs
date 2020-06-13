import { ViewType } from "../views/View";

export interface IGameModel {
    viewType: ViewType;
    id: string;
    dispose(): void;
}