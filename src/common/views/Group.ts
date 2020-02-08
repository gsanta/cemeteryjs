
export enum GroupType {
    Path = 'Path'
}

export interface Group {
    type: GroupType;
    name: string;
}