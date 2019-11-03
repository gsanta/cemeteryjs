import { WorldItem } from "../../WorldItem";
import { Modifier } from './Modifier';
import { Polygon } from "@nightshifts.inc/geometry";
import { SegmentBordersModifier } from './SegmentBordersModifier';
import { without } from "../utils/Functions";
import { ServiceFacade } from '../services/ServiceFacade';

/**
 * Creates relationship between `WorldItem`'s via adding a `WorldItem` to another as
 * a child based on wheter one fully contains the other.
 */

export class BuildHierarchyModifier implements Modifier {
    static modName = 'buildHierarchy';
    dependencies = [SegmentBordersModifier.modName]
    private services: ServiceFacade<any, any, any>;

    constructor(services: ServiceFacade<any, any, any>) {
        this.services = services;
    }

    getName(): string {
        return BuildHierarchyModifier.modName;
    }

    apply(gwmWorldItems: WorldItem[]): WorldItem[] {
        return this.buildHierarchy(gwmWorldItems);
    }

    buildHierarchy(worldItems: WorldItem[]) {
        const furnitureTypes = this.services.configService.furnitures.map(furniture => furniture.typeName);
        const furnitures =  worldItems.filter(item => furnitureTypes.includes(item.name))
        const subareas = worldItems.filter(item => item.name === '_subarea');
        const empty = worldItems.filter(item => item.name === 'empty');
        const rooms = worldItems.filter(item => item.name === 'room');
        const roots = worldItems.filter(item => item.name === 'root');
        const borders = without(worldItems, ...[...rooms, ...roots, ...empty, ...furnitures, ...subareas]);


        const remainingFurnitures = this.addChildren(subareas, furnitures);
        this.addChildren(rooms, [...subareas, ...remainingFurnitures, ...empty]);

        roots[0].children = [...rooms, ...borders];

        return [roots[0]];
    }

    private addChildren(parents: WorldItem[], children: WorldItem[]): WorldItem[] {
        parents.forEach(parent => {
            const remove: WorldItem[] = [];
            children.forEach(child => {
                if ((<Polygon>parent.dimensions).contains(<Polygon> child.dimensions)) {
                    parent.addChild(child);
                    child.parent = parent;
                    remove.push(child);
                }
            });

            children = without(children, ...remove);
        });

        return children;
    }
}