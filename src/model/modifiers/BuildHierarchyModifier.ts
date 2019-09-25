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

    // buildHierarchy(worldItems: WorldItem[]) {
    //     const childrenAlreadyCategorized = [];

    //     // worldItems.sort((a, b) => (<Polygon> a.dimensions).getArea() - (<Polygon> b.dimensions).getArea());
    //     let rootWorldItems = worldItems;
    //     const borderItems = worldItems.filter(item => this.services.configService.furnitureTypes.includes(item.name));
    //     worldItems = without(worldItems, ...borderItems);

    //     const empties = worldItems.filter(item => item.name === 'empty');

    //     worldItems.forEach(currentItem => {

    //         return without(worldItems, ...[...childrenAlreadyCategorized, currentItem, ...borderItems])
    //             .forEach((childItem: WorldItem) => {
    //                 if ((<Polygon>currentItem.dimensions).contains(<Polygon> childItem.dimensions) && !empties.includes(currentItem)) {
    //                     // this condition ensures that no two items will be each other's children if they would have the
    //                     // same size
    //                     if (childItem.children.indexOf(currentItem) === -1) {
    //                         currentItem.addChild(childItem);
    //                         childItem.parent = currentItem;
    //                         childrenAlreadyCategorized.push(childItem);
    //                         rootWorldItems = without(rootWorldItems, childItem);
    //                     }
    //                 }
    //             });
    //     });

    //     // rootWorldItems = rootWorldItems.concat(...borderItems);

    //     return [...rootWorldItems, ...borderItems];
    // }

    buildHierarchy(worldItems: WorldItem[]) {
        const furnitures = worldItems.filter(item => this.services.configService.furnitureTypes.includes(item.name))
        const subareas = worldItems.filter(item => item.name === '_subarea');
        const empty = worldItems.filter(item => item.name === 'empty');
        const rooms = worldItems.filter(item => item.name === 'room');
        const roots = worldItems.filter(item => item.name === 'root');
        const borders = without(worldItems, ...[...rooms, ...roots, ...empty, ...furnitures, ...subareas]);


        const remainingFurnitures = this.addChildren(subareas, furnitures);
        this.addChildren(rooms, [...subareas, ...remainingFurnitures, ...empty]);


        // worldItems.forEach(currentItem => {

        //     return without(worldItems, ...[...childrenAlreadyCategorized, currentItem])
        //         .forEach((childItem: WorldItem) => {
        //             if ((<Polygon>currentItem.dimensions).contains(<Polygon> childItem.dimensions)) {
        //                 // this condition ensures that no two items will be each other's children if they would have the
        //                 // same size
        //                 if (childItem.children.indexOf(currentItem) === -1) {
        //                     currentItem.addChild(childItem);
        //                     childItem.parent = currentItem;
        //                     childrenAlreadyCategorized.push(childItem);
        //                     rootWorldItems = without(rootWorldItems, childItem);
        //                 }
        //             }
        //         });
        // });

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