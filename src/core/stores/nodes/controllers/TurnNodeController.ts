import { AbstractController } from '../../../plugins/controllers/AbstractController';
import { UI_Plugin } from '../../../plugins/UI_Plugin';
import { Registry } from '../../../Registry';

export enum TurnNodeProps {
    SelectTurn = 'SelectTurn'
}


export class TurnNodeController extends AbstractController {
    
    constructor(plugin: UI_Plugin, registry: Registry) {
        super(plugin, registry);

        this.createPropHandler(TurnNodeProps.SelectTurn)
            .onChange(() => {

            })
            .onGet((context) => {
                return []
            });
    }
}