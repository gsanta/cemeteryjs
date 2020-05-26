import * as React from 'react';
import { AccordionComponent } from '../../../core/gui/misc/AccordionComponent';
import { AppContext, AppContextType } from '../../../core/gui/Context';
import { DroppableListItemComponent } from '../../../core/gui/inputs/DroppableListItemComponent';
import { DroppablePreset, NodePreset } from '../../../core/models/nodes/NodePreset';
import { CanvasToolsProps } from '../../../core/ViewFactory';
import { NodeEditorPlugin } from '../NodeEditorPlugin';
import { NodeEditorSettings } from './NodeEditorSettings';
import { NodeCategory, NodeModel, DroppableNode } from '../../../core/models/nodes/NodeModel';

export class NodeEditorSettingsComponent extends React.Component<{settings: NodeEditorSettings}> {
    static contextType = AppContext;
    context: AppContextType;

    render() {
        const view = this.context.registry.services.layout.getViewById(NodeEditorPlugin.id);

        return (
            <div>
                {this.renderNodesByCategory()}
                {this.renderPresets()}
            </div>
        );
    }

    private renderPresets() {
        const presets = this.context.registry.stores.nodeStore.presets;

        const listItems: JSX.Element[] = presets.map((preset: NodePreset) => {
            return (
                <DroppableListItemComponent 
                    key={preset.presetName}
                    type={preset.presetName}
                    onMouseDown={() => this.context.registry.services.mouse.onDragStart(new DroppablePreset(preset))}
                    onDrop={() => this.context.registry.services.mouse.onDrop()}
                />
            );
        });

        return <AccordionComponent elements={[{title: 'Presets', body: listItems}]}/>;
    }

    renderNodesByCategory() {
        const nodeTypesByCategory: Map<NodeCategory, NodeModel[]> = new Map();

        this.context.registry.stores.nodeStore.templates.forEach(node => {
            if (!nodeTypesByCategory.get(node.category)) {
                nodeTypesByCategory.set(node.category, []);
            }
            nodeTypesByCategory.get(node.category).push(node);
        });

        const groups: CanvasToolsProps[] = Array.from(nodeTypesByCategory.values()).map((nodes: NodeModel[]) => {
            const items = nodes.map((node) => (
                <DroppableListItemComponent 
                    key={node.type}
                    type={node.type}
                    onMouseDown={() => this.context.registry.services.mouse.onDragStart(new DroppableNode(node))}
                    onDrop={() => this.context.registry.services.mouse.onDrop()}
                />
            ));

            return {
                title: nodes[0].category,
                body: items
            }
        });

        return <AccordionComponent elements={groups}/>;
    }
}