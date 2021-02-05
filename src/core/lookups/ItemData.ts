import { IStore } from "../stores/IStore";


export class ItemData<D> {
    items: IStore<D>;
    selection: IStore<D>;
}