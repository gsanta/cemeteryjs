

export enum ViewType {
    GameObject = 'GameObject',
    Path = 'Path'
}

export interface View {
    viewType: ViewType;
}