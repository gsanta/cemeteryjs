import { NodeModel, NodeType } from "../views/nodes/NodeModel";
import { Point } from "../../geometry/shapes/Point";
import { Registry } from "../../Registry";
import { NodeView } from "../views/NodeView";
import { ConceptType } from "../views/View";
import { Rectangle } from "../../geometry/shapes/Rectangle";
import { createNodeSettings } from "../../../plugins/action_editor/settings/nodes/nodeSettingsFactory";
import { DroppableItem } from "../../../plugins/common/tools/DragAndDropTool";

export interface NodePresetRecipe {
    presetName: string;
    nodes: {
        type: NodeType,
        relativeCoord: Point
    }[]
}

export class NodePreset {
    presetName: string;
    private registry: Registry;
    private recipe: NodePresetRecipe;

    constructor(registry: Registry, recipe: NodePresetRecipe) {
        this.registry = registry;
        this.recipe = recipe;
        this.presetName = this.recipe.presetName;
    }

    createPreset(centerPoint: Point) {
        this.recipe.nodes.forEach(node => {
            const id = this.registry.stores.nodeStore.generateUniqueName(ConceptType.ActionConcept);
            const topLeft = centerPoint.clone().subtract(node.relativeCoord);
            const bottomRight = topLeft.clone().add(new Point(200, 150));
            const nodeView = new NodeView(id, node.type, new Rectangle(topLeft, bottomRight), this.registry.stores.nodeStore.graph);
            this.registry.stores.nodeStore.addNode(nodeView, createNodeSettings(nodeView, this.registry));
        });
    }
}

export class DroppablePreset implements DroppableItem {
    itemType = 'Preset'
    preset: NodePreset;

    constructor(preset: NodePreset) {
        this.preset = preset;
    }
}