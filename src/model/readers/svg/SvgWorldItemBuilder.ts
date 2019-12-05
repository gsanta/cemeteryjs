import { IWorldItemBuilder } from "../IWorldItemBuilder";
import { WorldItem } from '../../../WorldItem';


export class SvgWorldItemBuilder implements IWorldItemBuilder {

    build(worldMap: string): WorldItem[] {
        return [];
    }
}