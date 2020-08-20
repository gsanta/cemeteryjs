import { AbstractController } from '../../../plugins/controllers/AbstractController';
import { UI_Plugin } from '../../../plugins/UI_Plugin';
import { Registry } from '../../../Registry';

export enum AnimationNodeProps {
    SelectAnimation = 'SelectAnimation'
}

export class AnimationNodeController extends AbstractController {
    
    constructor(plugin: UI_Plugin, registry: Registry) {
        super(plugin, registry);

        this.createPropHandler(AnimationNodeProps.SelectAnimation)
            .onChange(() => {

            })
            .onGet((context) => {
                return []
            });
    }
}