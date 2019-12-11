import { maxBy } from './model/utils/Functions';

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
    id: string;
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

export namespace WorldItemDefinition {
    export function borders(templates: WorldItemDefinition[]): WorldItemDefinition[] {
        return templates.filter(templates => templates.roles.includes(WorldItemRole.BORDER));
    }

    export function generateId(exisingWorldItemDefinitions: WorldItemDefinition[]): string {
        if (exisingWorldItemDefinitions.length === 0) { return 1 + ''; }

        const defWithMaxId = maxBy<WorldItemDefinition>(exisingWorldItemDefinitions, definition => parseInt(definition.id, 10));
        
        return parseInt(defWithMaxId.id, 10) + 1 + '';
    }

    export function clone(worldItemDefinition: WorldItemDefinition): WorldItemDefinition {
        const clone = {...worldItemDefinition};
        clone.realDimensions = {...clone.realDimensions};
        clone.materials = [...clone.materials];
        clone.roles = [...clone.roles];

        return clone;
    }

    export function cloneAll(worldItemDefinitions: WorldItemDefinition[]): WorldItemDefinition[] {
        return worldItemDefinitions.map(def => this.clone(def));
    }

    export function getByTypeName(typeName: string, worldItemDefinitions: WorldItemDefinition[]): WorldItemDefinition {
        return worldItemDefinitions.find(def => def.typeName === typeName);
    }
}