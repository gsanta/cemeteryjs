import { AbstractViewStore } from './AbstractViewStore';
import { Registry } from '../Registry';
import { SpriteView } from '../models/views/SpriteView';

export class SpriteStore extends AbstractViewStore<SpriteView> {
    private registry: Registry;

    constructor(registry: Registry) {
        super();
        this.registry = registry;
    }

    addItem(spriteView: SpriteView) {
        super.addItem(spriteView);

        this.views.push(spriteView);
    }
}