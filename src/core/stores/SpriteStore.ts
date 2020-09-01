import { AbstractViewStore } from './AbstractViewStore';
import { Registry } from '../Registry';
import { SpriteView, SpriteViewType } from '../models/views/SpriteView';

export class SpriteStore extends AbstractViewStore<SpriteView> {
    private registry: Registry;

    constructor(registry: Registry) {
        super();
        this.registry = registry;
    }

    addItem(spriteView: SpriteView) {
        spriteView.id = this.generateId(SpriteViewType);
        spriteView.obj.id = spriteView.id;
        super.addItem(spriteView);

        this.views.push(spriteView);
        this.registry.stores.objStore.addObj(spriteView.obj);
    }
}