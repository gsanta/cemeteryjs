import { NodeView } from "../../../../core/stores/views/NodeView";
import { Registry } from "../../../../core/Registry";
import { ViewSettings } from "../../../scene_editor/settings/AbstractSettings";
import { TurnNode } from '../../../../core/stores/nodes/TurnNode';

export enum TurnNodeProps {
    AllTurns = 'AllTurns',
    Turn = 'Turn',
}
export class TurnNodeSettings extends ViewSettings<TurnNodeProps, NodeView> {
    static settingsName = 'turn-node-settings';
    getName() { return TurnNodeSettings.settingsName; }
    nodeView: NodeView<TurnNode>;
    private registry: Registry;

    constructor(actionNodeConcept: NodeView<TurnNode>, registry: Registry) {
        super();
        this.nodeView = actionNodeConcept;
        this.registry = registry;
    }

    protected getProp(prop: TurnNodeProps) {
        switch (prop) {
            case TurnNodeProps.AllTurns:
                return this.nodeView.model.allTurns;
            case TurnNodeProps.Turn:
                return this.nodeView.model.turn;
        }
    }

    protected setProp(val: any, prop: TurnNodeProps) {
        switch (prop) {
            case TurnNodeProps.Turn:
                this.nodeView.model.turn = val;
                break;
            default:
                throw new Error(`${prop} is not a writeable property.`)
        }
        this.registry.services.render.reRender(this.registry.services.pointer.hoveredPlugin.region);
    }
}
