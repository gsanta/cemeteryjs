
export enum WorldItemRole {
    BORDER = 'border',
    CHILD = 'child'
}

export namespace WorldItemRole {
    
    export function fromString(str: string) {
        switch(str) {
            case 'border':
                return WorldItemRole.BORDER;
            case 'child':
                return WorldItemRole.CHILD;
        }
    }
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
    roles?: WorldItemRole[];
    realDimensions?: {
        width: number;
        height?: number;
    }
}