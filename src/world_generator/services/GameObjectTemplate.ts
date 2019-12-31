import { maxBy } from '../utils/Functions';

export interface GameObjectTemplate {
    id: string;
    typeName: string;
    char?: string;
    color?: string;
    model?: string;
    shape?: string;
    scale?: number;
    translateY?: number;
    materials?: string[];
    realDimensions?: {
        width: number;
        height?: number;
    }
}

export namespace GameObjectTemplate {
    export function generateId(exisingWorldItemDefinitions: GameObjectTemplate[]): string {
        if (exisingWorldItemDefinitions.length === 0) { return 1 + ''; }

        const defWithMaxId = maxBy<GameObjectTemplate>(exisingWorldItemDefinitions, definition => parseInt(definition.id, 10));
        
        return parseInt(defWithMaxId.id, 10) + 1 + '';
    }

    export function clone(worldItemDefinition: GameObjectTemplate): GameObjectTemplate {
        const clone = {...worldItemDefinition};
        clone.realDimensions = {...clone.realDimensions};
        clone.materials = [...clone.materials];

        return clone;
    }

    export function cloneAll(worldItemDefinitions: GameObjectTemplate[]): GameObjectTemplate[] {
        return worldItemDefinitions.map(def => this.clone(def));
    }

    export function getByTypeName(typeName: string, worldItemDefinitions: GameObjectTemplate[]): GameObjectTemplate {
        return worldItemDefinitions.find(def => def.typeName === typeName);
    }
}