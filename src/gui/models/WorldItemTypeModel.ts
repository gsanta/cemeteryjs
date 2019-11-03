import { WorldItemType } from '../../WorldItemType';
import { ControllerFacade } from '../controllers/ControllerFacade';

export function cloneWorldItemType(descriptor: WorldItemType) {
    const clone = {...descriptor};

    if (clone.materials) {
        clone.materials = [...clone.materials];
    }

    return clone;
}

export class WorldItemTypeModel {
    types: WorldItemType[];
    selectedType: WorldItemType;

    private typesByTypeName: Map<string, WorldItemType>;

    constructor(initialWorldItemTypes: WorldItemType[]) {
        this.types = initialWorldItemTypes;
        this.createMapByTypeName();
    }

    syncSelected(origTypeName: string) {
        const origWorldItemType = this.types.find(type => type.typeName === origTypeName);
        const clone = [...this.types];
        clone.splice(this.types.indexOf(origWorldItemType), 1, cloneWorldItemType(this.selectedType));
        this.types = clone;
        this.createMapByTypeName();
    }

    getByTypeName(typeName: string): WorldItemType {
        return this.typesByTypeName.get(typeName);
    }

    private createMapByTypeName() {
        this.typesByTypeName = new Map();
        this.types.forEach(type => this.typesByTypeName.set(type.typeName, type));
    }
}