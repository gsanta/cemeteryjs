import { AnimationNode } from "../../../../core/models/views/nodes/AnimationNode";
import { NodeView } from "../../../../core/models/views/NodeView";
import { Registry } from "../../../../core/Registry";
import { UpdateTask } from "../../../../core/services/UpdateServices";
import { ViewSettings } from "../../../scene_editor/settings/AbstractSettings";

export enum AnimationNodeProps {
    Animation = 'Animation',
    AllAnimations = 'AllAnimations'
}

export class AnimationNodeSettings extends ViewSettings<AnimationNodeProps, NodeView> {
    static settingsName = 'animation-node-settings';
    getName() { return AnimationNodeSettings.settingsName; }
    view: NodeView<AnimationNode>;
    private registry: Registry;

    constructor(actionNodeConcept: NodeView<AnimationNode>, registry: Registry) {
        super();
        this.view = actionNodeConcept;
        this.registry = registry;
    }

    protected getProp(prop: AnimationNodeProps) {
        switch (prop) {
            case AnimationNodeProps.AllAnimations:
                return this.view.node.allAnimations;
            case AnimationNodeProps.Animation:
                return this.view.node.animation;
        }
    }

    protected setProp(val: any, prop: AnimationNodeProps) {
        switch (prop) {
            case AnimationNodeProps.Animation:
                this.view.node.animation = val;
                break;
        }
        this.registry.services.update.runImmediately(UpdateTask.RepaintActiveView);
    }
}
