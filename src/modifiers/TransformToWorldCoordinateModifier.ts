import { WorldItem } from "../WorldItemInfo";
import { Modifier } from "./Modifier";
import { Shape, Point } from "@nightshifts.inc/geometry";
import { TreeIteratorGenerator } from "../utils/TreeIteratorGenerator";

export class TransformToWorldCoordinateModifier implements Modifier {

    public apply(worldItems: WorldItem[]): WorldItem[] {
        worldItems.forEach(rootItem => {
            for (const item of TreeIteratorGenerator(rootItem)) {
                if (item !== rootItem) {
                    item.dimensions = this.moveToWorldCenter(item, rootItem);
                    item.dimensions = item.dimensions.negate('y');
                }
            }
        });

        return worldItems;
    }


    private moveToWorldCenter(worldItemInfo: WorldItem, root: WorldItem): Shape {
        const translateX = - (root.dimensions.getBoundingInfo().extent[0] / 2);
        const translateY = - (root.dimensions.getBoundingInfo().extent[1] / 2);

        return worldItemInfo.dimensions.translate(new Point(translateX, translateY));
    }
}