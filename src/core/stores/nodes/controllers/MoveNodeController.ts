import { AbstractController } from '../../../plugins/controllers/AbstractController';
import { UI_Plugin } from '../../../plugins/UI_Plugin';
import { Registry } from '../../../Registry';

export enum MoveNodeProps {
    SelectMove = 'SelectMove',
    Speed = 'Speed'
}

export class MoveNodeController extends AbstractController {
    
    constructor(plugin: UI_Plugin, registry: Registry) {
        super(plugin, registry);

        this.createPropHandler(MoveNodeProps.SelectMove)
            .onChange(() => {

            })
            .onGet((context) => {
                return []
            });

        this.createPropHandler(MoveNodeProps.Speed)
            .onChange(() => {

            })
            .onGet((context) => {
                return []
            });
    }
}