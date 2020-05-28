import * as React from 'react';
import styled from 'styled-components';
import { AppContext, AppContextType } from '../../core/gui/Context';
import { colors } from '../../core/gui/styles';
import { PathMarkersComponent } from '../../core/services/export/PathMarkersComponent';
import { WheelListener } from '../../core/services/WheelListener';
import { WindowToolbarStyled } from '../../core/WindowToolbar';
import { RedoIconComponent } from '../common/toolbar/icons/RedoIconComponent';
import { UndoIconComponent } from '../common/toolbar/icons/UndoIconComponent';
import { ToolbarComponent } from '../common/toolbar/ToolbarComponent';
import { ToolType } from '../common/tools/Tool';
import { SceneEditorPlugin } from './SceneEditorPlugin';
import { CanvasComponent } from '../common/CanvasComponent';
import { View } from '../../core/models/views/View';

const EditorComponentStyled = styled.div`
    width: 100%;
    height: 100%;
    position: relative;
`;

const SceneEditorComponentStyled = styled.svg`
    width: 100%;
    height: 100%;
    background: ${colors.panelBackgroundMedium};
`;

const SelectionComponentStyled = styled.rect`
    stroke: red;
    stroke-width: 1px;
    fill: transparent;
`;

export class SceneEditorComponent extends CanvasComponent {
    static contextType = AppContext;
    context: AppContextType;
    private wheelListener: WheelListener;

    componentDidMount() {
        super.componentDidMount();
        this.wheelListener = new WheelListener(this.context.registry);
        this.context.registry.services.update.setCanvasRepainter(() => this.forceUpdate());
        this.context.registry.services.plugin.getViewById(SceneEditorPlugin.id).repainter = () => {this.forceUpdate()};

        setTimeout(() => {
            this.context.registry.services.plugin.getViewById<SceneEditorPlugin>(SceneEditorPlugin.id).resize();
        }, 0);
    }

    render(): JSX.Element {
        const hover = (item: View) => this.context.registry.services.mouse.hover(item);
        const unhover = (canvasItem: View) => this.context.registry.services.mouse.unhover(canvasItem);
        
        const view = this.context.registry.services.plugin.getViewById<SceneEditorPlugin>(SceneEditorPlugin.id);
        const history = this.context.registry.services.history;

        return (
            <EditorComponentStyled ref={this.ref} id={view.getId()} style={{cursor: view.getActiveTool().getCursor()}}>
                <WindowToolbarStyled>
                    <ToolbarComponent
                        tools={[ToolType.Rectangle, ToolType.Path, ToolType.Select, ToolType.Delete, ToolType.Zoom, ToolType.Pan]}
                        view={view}
                    >
                        <UndoIconComponent key={'undo-icon'} isActive={false} disabled={!history.hasUndoHistory()} onClick={() => history.undo()} format="short"/>
                        <RedoIconComponent key={'redo-icon'} isActive={false} disabled={!history.hasRedoHistory()} onClick={() => history.redo()} format="short"/>
    
                    </ToolbarComponent>
                </WindowToolbarStyled>
                <SceneEditorComponentStyled
                    tabIndex={0}
                    viewBox={view.getCamera().getViewBoxAsString()}
                    id={this.context.controllers.svgCanvasId}
                    onMouseDown={(e) => this.context.registry.services.mouse.onMouseDown(e.nativeEvent)}
                    onMouseMove={(e) => this.context.registry.services.mouse.onMouseMove(e.nativeEvent)}
                    onMouseUp={(e) => this.context.registry.services.mouse.onMouseUp(e.nativeEvent)}
                    onMouseLeave={(e) => this.context.registry.services.mouse.onMouseOut(e.nativeEvent)}
                    onKeyDown={e => this.context.registry.services.keyboard.onKeyDown(e.nativeEvent)}
                    onKeyUp={e => this.context.registry.services.keyboard.onKeyUp(e.nativeEvent)}
                    onMouseOver={() => view.over()}
                    onMouseOut={() => view.out()}
                    onWheel={(e) => this.wheelListener.onWheel(e.nativeEvent)}
                >
                    <defs>
                        <PathMarkersComponent/>
                    </defs>
                    {this.context.registry.services.export.meshConceptExporter.export(hover, unhover)}
                    {this.context.registry.services.export.pathConceptExporter.export(hover, unhover)}
                    {this.renderFeedbacks()}
                </SceneEditorComponentStyled>
            </EditorComponentStyled>
        );
    }

    private renderFeedbacks(): JSX.Element {
        const feedback = this.context.registry.stores.feedback.rectSelectFeedback;

        if (feedback && feedback.isVisible) {
            const rect = this.context.registry.stores.feedback.rectSelectFeedback.rect;
            return (
                <SelectionComponentStyled 
                    x={rect.topLeft.x}
                    y={rect.topLeft.y}
                    width={rect.getWidth()}
                    height={rect.getHeight()}
                />
            );
        }

        return null;
    }
}