import { WorldItemDefinition } from '../../../WorldItemDefinition';
import { ControllerFacade } from '../ControllerFacade';

export function cloneWorldItemType(descriptor: WorldItemDefinition) {
    const clone = {...descriptor};

    if (clone.materials) {
        clone.materials = [...clone.materials];
    }

    return clone;
}

export class WorldItemDefinitionModel {
    types: WorldItemDefinition[];
    selectedType: WorldItemDefinition;

    private typesByTypeName: Map<string, WorldItemDefinition>;

    constructor(initialWorldItemTypes: WorldItemDefinition[]) {
        this.types = initialWorldItemTypes;
        this.createMapByTypeName();
    }

    setTypes(types: WorldItemDefinition[]) {
        this.types = types;
        this.selectedType = types[0];
        this.createMapByTypeName();
    }

    syncSelected(origTypeName: string) {
        const origWorldItemType = this.types.find(type => type.typeName === origTypeName);
        const clone = [...this.types];
        clone.splice(this.types.indexOf(origWorldItemType), 1, cloneWorldItemType(this.selectedType));
        this.types = clone;
        this.createMapByTypeName();
    }

    getByTypeName(typeName: string): WorldItemDefinition {
        return this.typesByTypeName.get(typeName);
    }

    private createMapByTypeName() {
        this.typesByTypeName = new Map();
        this.types.forEach(type => this.typesByTypeName.set(type.typeName, type));
    }
}