import * as React from 'react';
import { ToolType } from "../tools/Tool";
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

export function createToolIcon(toolType: ToolType, view: AbstractPlugin, registry: Registry): JSX.Element[] {

    switch(toolType) {
        case ToolType.Rectangle:
            return [<RectangleIconComponent key={toolType} isActive={isToolActive(ToolType.Rectangle, view)} onClick={() => activateTool(toolType, view, registry)} format="short"/>]
        case ToolType.Delete:
            return [<DeleteIconComponent key={toolType} isActive={isToolActive(ToolType.Delete, view)} onClick={() => activateTool(toolType, view, registry)} format="short"/>]
        case ToolType.Select:
            return [<SelectIconComponent key={toolType} isActive={isToolActive(ToolType.Select, view)} onClick={() => activateTool(toolType, view, registry)} format="short"/>]
        case ToolType.Pan:
            return [<PanIconComponent key={toolType} isActive={isToolActive(ToolType.Pan, view)} onClick={() => activateTool(toolType, view, registry)} format="short"/>]
        case ToolType.Path:
        case ToolType.Join:
            return [<PathIconComponent key={toolType} isActive={isToolActive(toolType, view)} onClick={() => activateTool(toolType, view, registry)} format="short"/>]    
        case ToolType.Zoom:
            return [
                <ZoomInIconComponent key={'zoom-in'} isActive={false} onClick={() => zoomIn(toolType, view, registry)} format="short"/>,
                <ZoomOutIconComponent key={'zoom-out'} isActive={false} onClick={() => zoomOut(toolType, view, registry)} format="short"/>
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
        return view.getSelectedTool() && view.getSelectedTool().type === toolType;
}

function activateTool(toolType: ToolType, view: AbstractPlugin, registry: Registry) {
    view.setSelectedTool(registry.tools.getByType(toolType) as AbstractTool);
    registry.services.hotkey.focus();
}
