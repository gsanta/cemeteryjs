import { GameObject } from '../services/GameObject';
import { Modifier } from './Modifier';
import { without } from "../utils/Functions";
import { WorldGeneratorServices } from '../services/WorldGeneratorServices';
import { WorldItemRole } from "../services/GameObjectTemplate";
import { Polygon } from '../../model/geometry/shapes/Polygon';

/**
 * Creates relationship between `WorldItem`'s via adding a `WorldItem` to another as
 * a child based on wheter one fully contains the other.
 */

export class BuildHierarchyModifier implements Modifier {
    static modName = 'buildHierarchy';
    private services: WorldGeneratorServices;

    constructor(services: WorldGeneratorServices) {
        this.services = services;
    }

    getName(): string {
        return BuildHierarchyModifier.modName;
    }

    apply(gwmWorldItems: GameObject[]): GameObject[] {
        return this.buildHierarchy(gwmWorldItems);
    }

    private buildHierarchy(worldItems: GameObject[]) {
        const sizeComparer = (a: GameObject, b: GameObject) => (<Polygon> a.dimensions).getArea() - (<Polygon> b.dimensions).getArea(); 

        const borders = worldItems.filter(worldItem => worldItem.roles.includes(WorldItemRole.BORDER));
        //TODO: handle empties better
        let notBorders = worldItems.filter(item => item.name !== 'empty').filter(worldItem => !worldItem.roles.includes(WorldItemRole.BORDER));

        const containers = notBorders.filter(worldItem => worldItem.roles.includes(WorldItemRole.CONTAINER));
        const notContainers = notBorders.filter(worldItem => !worldItem.roles.includes(WorldItemRole.CONTAINER));
        
        const sortedContainers = [...containers];
        sortedContainers.sort(sizeComparer);

        let remainingItems = [...containers, ...notContainers];

        sortedContainers.forEach(container => {
            const remove: GameObject[] = [];

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