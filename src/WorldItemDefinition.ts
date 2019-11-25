
export enum WorldItemRole {
    BORDER = 'border',
    CHILD = 'child'
}

export interface WorldItemDefinition {
    typeName: string;
    char?: string;
    color?: string;
    model?: string;
    shape?: string;
    scale?: number;
    translateY?: number;
    materials?: string[];
    isBorder?: boolean;
    roles?: WorldItemRole[];
    realDimensions?: {
        width: number;
        height?: number;
    }
}