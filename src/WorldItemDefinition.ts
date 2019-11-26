
export enum WorldItemRole {
    BORDER = 'border',
    CONTAINER = 'container'
}

export namespace WorldItemRole {
    
    export function fromString(str: string) {
        switch(str) {
            case 'border':
                return WorldItemRole.BORDER;
            case 'container':
                return WorldItemRole.CONTAINER;
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