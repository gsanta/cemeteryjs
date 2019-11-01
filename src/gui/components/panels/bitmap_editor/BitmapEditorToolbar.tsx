import * as React from 'react';
import { ToolType } from '../../../controllers/bitmap_editor/tools/Tool';
import { AppContext, AppContextType } from '../../Context';
import { BrushIconComponent } from '../../icons/BrushIconComponent';
import { DeleteIconComponent } from '../../icons/DeleteIconComponent';

export class BitmapEditorToolbar extends React.Component<any> {
    static contextType = AppContext;
    context: AppContextType;

    render(): JSX.Element {
        return (
            <div>
                <BrushIconComponent isActive={this.isToolActive(ToolType.RECTANGLE)} onClick={() => this.activateTool(ToolType.RECTANGLE)}/>
                <DeleteIconComponent isActive={this.isToolActive(ToolType.DELETE)} onClick={() => this.activateTool(ToolType.DELETE)}/>
            </div>
        );
    }

    private isToolActive(toolType: ToolType) {
        return this.context.controllers.bitmapEditor.activeTool.type === toolType;
    }

    private activateTool(toolType: ToolType) {
        this.context.controllers.bitmapEditor.setActiveTool(toolType);
    }
}