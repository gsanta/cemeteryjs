import { ItemFactory } from "../models/modules/ItemFactory";
import { IStore } from "./stores/IStore";
import { TagStore } from "./stores/TagStore";

export class ItemData<D> {
    items: IStore<D>;
}