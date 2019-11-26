import { Polygon, Point, Shape } from '@nightshifts.inc/geometry';
import { WorldItem } from '../../WorldItem';
import { ServiceFacade } from './ServiceFacade';
import { WorldItemDefinition } from '../../WorldItemDefinition';

export interface WorldItemConfig {
    type?: string;
    dimensions: Shape;
    name: string;
    isBorder: boolean;
    rotation?: number;
    worldMapPositions?: Point[];
}

export const defaultWorldItemConfig: Partial<WorldItemConfig> = {
    rotation: 0,
    worldMapPositions: []
}

/**
 * new `WorldItem` instances should be created via this class, so that a unique id can be set
 * for each new instance.
 */
export class WorldItemFactoryService {
    private countersByType: Map<string, number> = new Map();
    private services: ServiceFacade<any, any, any>;

    constructor(services: ServiceFacade<any, any, any>) {
        this.services = services;
    }

    public createOld(type: string, dimensions: Polygon, name: string, isBorder: boolean, rotation?: number): WorldItem {
        const id = this.getNextId(name);
        const worldItem = new WorldItem(id, type, dimensions, name, isBorder);
        if (rotation !== undefined) {
            worldItem.rotation = rotation;
        }

        return worldItem;
    }

    public create(worldItemConfig: WorldItemConfig, worldItemDefinition: WorldItemDefinition): WorldItem {
        worldItemConfig = {...defaultWorldItemConfig, ...worldItemConfig};

        const id = this.getNextId(worldItemConfig.name);
        const worldItem = new WorldItem(id, worldItemConfig.type, worldItemConfig.dimensions, worldItemConfig.name, worldItemConfig.isBorder);
        worldItem.worldMapPositions = worldItemConfig.worldMapPositions;
        worldItem.rotation = worldItemConfig.rotation;
        worldItem.definition = worldItemDefinition;
        return worldItem;
    }

    public clone(newType: string, worldItemInfo: WorldItem): WorldItem {
        const id = this.getNextId(newType);

        const clone = new WorldItem(
            id,
            worldItemInfo.type,
            worldItemInfo.dimensions,
            newType
        );

        clone.children = [...worldItemInfo.children];
        clone.borderItems = [...worldItemInfo.borderItems];
        clone.rotation = worldItemInfo.rotation;
        clone.isBorder = worldItemInfo.isBorder;
        clone.thickness = worldItemInfo.thickness;
        clone.parent = worldItemInfo.parent;
        clone.definition = worldItemInfo.definition;

        return clone;
    }

    private getNextId(name: string): string {
        if (!this.countersByType.has(name)) {
            this.countersByType.set(name, 1);
        }

        const id = `${name}-${this.countersByType.get(name)}`;

        this.countersByType.set(name, this.countersByType.get(name) + 1);

        return id;
    }
}