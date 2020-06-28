import { AbstractPlugin } from '../../core/AbstractPlugin';
import { Registry } from '../../core/Registry';
import { Tools } from '../Tools';

export class AssetManagerPlugin extends AbstractPlugin {
    static id = 'asset-manager-plugin';

    constructor(registry: Registry) {
        super(registry);

        this.tools = new Tools([]);
    }

    getStore() {
        return null;
    }


    componentMounted(htmlElement: HTMLElement) {
        super.componentMounted(htmlElement);
    }

    getId(): string {
        return AssetManagerPlugin.id;
    }
}