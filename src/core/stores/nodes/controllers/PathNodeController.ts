import { AbstractController } from '../../../plugins/controllers/AbstractController';
import { UI_Plugin } from '../../../plugins/UI_Plugin';
import { Registry } from '../../../Registry';

export enum PathNodeProps {
    SelectPath = 'SelectPath'
}


export class PathNodeController extends AbstractController {
    
    constructor(plugin: UI_Plugin, registry: Registry) {
        super(plugin, registry);

        this.createPropHandler(PathNodeProps.SelectPath)
            .onChange(() => {

            })
            .onGet((context) => {
                return []
            });
    }
}