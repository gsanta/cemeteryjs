import * as React from 'react';
import { ToolType } from "../tools/Tool";
import { RectangleIconComponent } from "./icons/RectangleIconComponent";
import { DeleteIconComponent } from "./icons/DeleteIconComponent";
import { SelectIconComponent } from "./icons/SelectIconComponent";
import { PanIconComponent } from "./icons/PanIconComponent";
import { ZoomInIconComponent } from "./icons/ZoomInIconComponent";
import { ZoomOutIconComponent } from "./icons/ZoomOutIconComponent";
import { View } from "../../../core/View";
import { Registry } from "../../../core/Registry";
import { AbstractTool } from "../tools/AbstractTool";

export function createToolIcon(toolType: ToolType, view: View, registry: Registry): JSX.Element[] {

    switch(toolType) {
        case ToolType.Rectangle:
            return [<RectangleIconComponent isActive={isToolActive(ToolType.Rectangle, view)} onClick={() => activateTool(toolType, view, registry)} format="short"/>]
        case ToolType.Delete:
            return [<DeleteIconComponent isActive={isToolActive(ToolType.Delete, view)} onClick={() => activateTool(toolType, view, registry)} format="short"/>]
        case ToolType.Select:
            return [<SelectIconComponent isActive={isToolActive(ToolType.Select, view)} onClick={() => activateTool(toolType, view, registry)} format="short"/>]
        case ToolType.Pan:
            return [<PanIconComponent isActive={isToolActive(ToolType.Pan, view)} onClick={() => activateTool(toolType, view, registry)} format="short"/>]
        case ToolType.Zoom:
            return [
                <ZoomInIconComponent isActive={false} onClick={() => view.getCamera().zoomIn()} format="short"/>,
                <ZoomOutIconComponent isActive={false} onClick={() => view.getCamera().zoomOut()} format="short"/>
            ];

    }
}

function isToolActive(toolType: ToolType, view: View) {
        return view.getSelectedTool() && view.getSelectedTool().type === toolType;
}

function activateTool(toolType: ToolType, view: View, registry: Registry) {
    view.setSelectedTool(registry.services.tools.getByType(toolType) as AbstractTool);
}
