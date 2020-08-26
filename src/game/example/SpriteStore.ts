import { AbstractStore } from '../../core/stores/AbstractStore';
import { AbstractViewStore } from '../../core/stores/AbstractViewStore';
import { Registry } from '../../core/Registry';


export class SpriteStore extends AbstractViewStore {
    private registry: Registry;

    constructor(registry: Registry) {
        super();
        this.registry = registry;
    }

    
}