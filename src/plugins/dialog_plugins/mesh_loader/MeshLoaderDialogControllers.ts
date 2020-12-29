import { MeshTreeNode } from "../../../core/models/objs/MeshObj";
import { ParamControllers } from "../../../core/plugin/controller/FormController";
import { Registry } from "../../../core/Registry";
import { TreeController, TreeData } from "../../../core/ui_components/elements/complex/tree/TreeController";
import { MeshView } from "../../canvas_plugins/scene_editor/views/MeshView";

export class MeshLoaderDialogControllers extends ParamControllers {
    constructor(registry: Registry) {
        super();
        this.tree = new MeshHierarchyTreeController(registry);
    }

    tree: MeshHierarchyTreeController;
}

export class MeshHierarchyTreeController extends TreeController {
    getData(): TreeData {
        const selectedViews = this.registry.data.view.scene.getSelectedViews();
        const meshView = <MeshView> selectedViews[0];
        
        const nodes = this.registry.engine.meshes.getMeshTree(meshView.getObj());
        return this.convertToTreeData(nodes);
    }

    check(data: TreeData): void {}
    toggle(data: TreeData): void {}

    private convertToTreeData(nodes: MeshTreeNode[]): TreeData {
        if (nodes.length > 1) {
            return {
                name: '_virtual_root__',
                toggled: true,
                checked: false,
                children: nodes.map(node => this.getTreeData(node))
            }
        } else {
            return this.getTreeData(nodes[0]);
        }
    }

    private getTreeData(node: MeshTreeNode): TreeData {
        return {
            name: node.name,
            toggled: false,
            checked: false,
            children: node.children.length > 0 ? node.children.map(child => this.getTreeData(child)) : undefined
        }
    }
}