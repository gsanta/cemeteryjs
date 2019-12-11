import { WorldItem } from '../../WorldItem';
import { Modifier } from './Modifier';
import { Polygon } from "@nightshifts.inc/geometry";
import { SegmentBordersModifier } from './SegmentBordersModifier';
import { without } from "../utils/Functions";
import { ServiceFacade } from '../services/ServiceFacade';
import { WorldItemRole } from "../../WorldItemTemplate";

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

    private buildHierarchy(worldItems: WorldItem[]) {
        const sizeComparer = (a: WorldItem, b: WorldItem) => (<Polygon> a.dimensions).getArea() - (<Polygon> b.dimensions).getArea(); 

        const borders = worldItems.filter(worldItem => worldItem.definition.roles.includes(WorldItemRole.BORDER));
        //TODO: handle empties better
        let notBorders = worldItems.filter(item => item.name !== 'empty').filter(worldItem => !worldItem.definition.roles.includes(WorldItemRole.BORDER));

        const containers = notBorders.filter(worldItem => worldItem.definition.roles.includes(WorldItemRole.CONTAINER));
        const notContainers = notBorders.filter(worldItem => !worldItem.definition.roles.includes(WorldItemRole.CONTAINER));
        
        const sortedContainers = [...containers];
        sortedContainers.sort(sizeComparer);

        let remainingItems = [...containers, ...notContainers];

        sortedContainers.forEach(container => {
            const remove: WorldItem[] = [];

            remainingItems.forEach(child => {
                if (container !== child && (<Polygon>container.dimensions).contains(<Polygon> child.dimensions)) {
                    container.addChild(child);
                    child.parent = container;
                    remove.push(child);
                }
            });

            remainingItems = without(remainingItems, ...remove);
        });


        const roots = worldItems.filter(item => item.name === 'root');
        roots[0].children = [...roots[0].children, ...borders]

        return roots;
    }
}