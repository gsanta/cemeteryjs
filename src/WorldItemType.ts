export interface WorldItemType {
    typeName: string;
    char?: string;
    color?: string;
    model?: string;
    shape?: string;
    scale?: number;
    translateY?: number;
    materials?: string[];
    isBorder?: boolean;
    realDimensions?: {
        width: number;
        height?: number;
    }
}