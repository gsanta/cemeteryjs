import { SplitNode } from '../../../../core/models/nodes/SplitNode';
import { NodeView } from "../../../../core/models/views/NodeView";
import { Registry } from "../../../../core/Registry";
import { ViewSettings } from "../../../scene_editor/settings/AbstractSettings";

export enum SplitNodeProps {
}
export class SplitNodeSettings extends ViewSettings<SplitNodeProps, NodeView> {
    static settingsName = 'turn-node-settings';
    getName() { return SplitNodeSettings.settingsName; }
    nodeView: NodeView<SplitNode>;
    private registry: Registry;

    constructor(nodeView: NodeView<SplitNode>, registry: Registry) {
        super();
        this.nodeView = nodeView;
        this.registry = registry;
    }

    protected getProp(prop: SplitNodeProps) {

    }

    protected setProp(val: any, prop: SplitNodeProps) {
        switch (prop) {
            default:
                throw new Error(`${prop} is not a writeable property.`)
        }
    }
}
