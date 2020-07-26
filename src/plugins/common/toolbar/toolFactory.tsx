import * as React from 'react';
import { ToolType, Tool } from "../tools/Tool";
import { RectangleIconComponent } from "./icons/RectangleIconComponent";
import { DeleteIconComponent } from "./icons/DeleteIconComponent";
import { SelectIconComponent } from "./icons/SelectIconComponent";
import { PanIconComponent } from "./icons/PanIconComponent";
import { PathIconComponent } from "./icons/PathIconComponent";
import { ZoomInIconComponent } from "./icons/ZoomInIconComponent";
import { ZoomOutIconComponent } from "./icons/ZoomOutIconComponent";
import { AbstractPlugin } from "../../../core/AbstractPlugin";
import { Registry } from "../../../core/Registry";
import { AbstractTool } from "../tools/AbstractTool";
import { DeleteTool } from '../tools/DeleteTool';
import { PointerTool } from '../tools/PointerTool';
import { PathTool } from '../tools/PathTool';
import { RectangleTool } from '../tools/RectangleTool';
import { SelectTool } from '../tools/SelectTool';
import { CameraTool } from '../tools/CameraTool';
import { DragAndDropTool } from '../tools/DragAndDropTool';
import { JoinTool } from '../tools/JoinTool';

export function toolFactory(toolType: ToolType, plugin: AbstractPlugin, registry: Registry): Tool {
    switch(toolType) {
        case ToolType.Delete:
            return new DeleteTool(plugin, registry);
        case ToolType.Pointer:
            return new PointerTool(ToolType.Pointer, plugin, registry);
        case ToolType.Path:
            return new PathTool(plugin, registry);
        case ToolType.Rectangle:
            return new RectangleTool(plugin, registry);
        case ToolType.Select:
            return new SelectTool(plugin, registry);
        case ToolType.Camera:
            return new CameraTool(plugin, registry);
        case ToolType.DragAndDrop:
            return new DragAndDropTool(plugin, registry);
        case ToolType.Join:
            return new JoinTool(plugin, registry);
    }
}

export function toolIconFactory(toolType: ToolType, plugin: AbstractPlugin, registry: Registry): JSX.Element[] {
    switch(toolType) {
        case ToolType.Rectangle:
            return [<RectangleIconComponent key={toolType} isActive={isToolActive(ToolType.Rectangle, plugin)} onClick={() => activateTool(toolType, plugin, registry)} format="short"/>]
        case ToolType.Delete:
            return [<DeleteIconComponent key={toolType} isActive={isToolActive(ToolType.Delete, plugin)} onClick={() => activateTool(toolType, plugin, registry)} format="short"/>]
        case ToolType.Select:
            return [<SelectIconComponent key={toolType} isActive={isToolActive(ToolType.Select, plugin)} onClick={() => activateTool(toolType, plugin, registry)} format="short"/>]
        case ToolType.Path:
        case ToolType.Join:
            return [<PathIconComponent key={toolType} isActive={isToolActive(toolType, plugin)} onClick={() => activateTool(toolType, plugin, registry)} format="short"/>]    
        case ToolType.Camera:
            return [
                <PanIconComponent 
                    key={toolType}
                    isActive={isToolActive(ToolType.Camera, plugin)}
                    onClick={() => activateTool(toolType, plugin, registry)}
                    format="short"
                />,
                <ZoomInIconComponent key={'zoom-in'} isActive={false} onClick={() => zoomIn(toolType, plugin, registry)} format="short"/>,
                <ZoomOutIconComponent key={'zoom-out'} isActive={false} onClick={() => zoomOut(toolType, plugin, registry)} format="short"/>
            ];

    }
}

function zoomIn(toolType: ToolType, view: AbstractPlugin, registry: Registry) {
    view.getCamera().zoomIn();
    registry.services.hotkey.focus();
}

function zoomOut(toolType: ToolType, view: AbstractPlugin, registry: Registry) {
    view.getCamera().zoomOut();
    registry.services.hotkey.focus();
}


function isToolActive(toolType: ToolType, view: AbstractPlugin) {
        return view.getSelectedTool() && view.getSelectedTool().id === toolType;
}

function activateTool(toolType: ToolType, plugin: AbstractPlugin, registry: Registry) {
    plugin.setSelectedTool(plugin.getToolById(toolType) as AbstractTool);
    registry.services.hotkey.focus();
}
