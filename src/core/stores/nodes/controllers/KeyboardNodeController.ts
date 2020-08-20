import { AbstractController } from '../../../plugins/controllers/AbstractController';
import { UI_Plugin } from '../../../plugins/UI_Plugin';
import { Registry } from '../../../Registry';

export enum KeyboardNodeProps {
    SelectKey = 'SelectKey'
}

export class KeyboardNodeController extends AbstractController {
    
    constructor(plugin: UI_Plugin, registry: Registry) {
        super(plugin, registry);

        this.createPropHandler(KeyboardNodeProps.SelectKey)
            .onChange(() => {

            })
            .onGet((context) => {
                return []
            });
    }
}