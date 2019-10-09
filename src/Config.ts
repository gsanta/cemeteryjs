

export interface MeshDescriptor {
    type: string;
    char?: string;
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