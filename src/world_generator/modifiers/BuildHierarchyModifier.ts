import { GameObject } from '../services/GameObject';
import { Modifier } from './Modifier';
import { without } from "../utils/Functions";
import { Polygon } from '../../model/geometry/shapes/Polygon';

/**
 * Creates relationship between `WorldItem`'s via adding a `WorldItem` to another as
 * a child based on wheter one fully contains the other.
 */

export class BuildHierarchyModifier implements Modifier {
    static modName = 'buildHierarchy';

    getName(): string {
        return BuildHierarchyModifier.modName;
    }

    apply(gwmWorldItems: GameObject[]): GameObject[] {
        return this.buildHierarchy(gwmWorldItems);
    }

    private buildHierarchy(worldItems: GameObject[]) {
        const sizeComparer = (a: GameObject, b: GameObject) => (<Polygon> a.dimensions).getArea() - (<Polygon> b.dimensions).getArea(); 
        
        const sortedContainers = [...worldItems];
        sortedContainers.sort(sizeComparer);

        let remainingItems = [...worldItems];

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
        roots[0].children = [...roots[0].children]

        return roots;
    }
}