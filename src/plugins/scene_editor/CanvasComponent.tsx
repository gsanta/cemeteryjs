import * as React from 'react';
import styled from 'styled-components';
import { AppContext, AppContextType } from '../../core/gui/Context';
import { colors } from '../../core/gui/styles';
import { WindowToolbarStyled } from '../../core/WindowToolbar';
import { PathMarkersComponent } from '../../core/services/export/PathMarkersComponent';
import { CanvasView } from './CanvasView';
import { WheelListener } from '../../core/services/WheelListener';
import { Concept } from '../../core/models/concepts/Concept';
import { IControl } from '../../core/models/controls/IControl';
import { ToolType } from '../common/tools/Tool';
import { ToolbarComponent } from '../common/toolbar/ToolbarComponent';
import { UndoIconComponent } from '../common/toolbar/icons/UndoIconComponent';
import { RedoIconComponent } from '../common/toolbar/icons/RedoIconComponent';
import { Hoverable } from '../../core/models/Hoverable';


const EditorComponentStyled = styled.div`
    width: 100%;
    height: 100%;
    position: relative;
`;

const CanvasComponentStyled = styled.svg`
    width: 100%;
    height: 100%;
    background: ${colors.panelBackgroundMedium};
`;

const SelectionComponentStyled = styled.rect`
    stroke: red;
    stroke-width: 1px;
    fill: transparent;
`;

export class CanvasComponent extends React.Component {
    static contextType = AppContext;
    context: AppContextType;
    private wheelListener: WheelListener;

    componentDidMount() {
        this.wheelListener = new WheelListener(this.context.registry);
        this.context.registry.services.update.setCanvasRepainter(() => this.forceUpdate());
        this.context.registry.services.layout.getViewById(CanvasView.id).repainter = () => {this.forceUpdate()};

        setTimeout(() => {
            this.context.registry.services.layout.getViewById<CanvasView>(CanvasView.id).resize();
        }, 0);
    }

    render(): JSX.Element {
        const hover = (item: Hoverable) => this.context.registry.services.mouse.hover(item);
        const unhover = (canvasItem: Hoverable) => this.context.registry.services.mouse.unhover(canvasItem);
        
        const view = this.context.registry.services.layout.getViewById<CanvasView>(CanvasView.id);
        const history = this.context.registry.services.history;

        return (
            <EditorComponentStyled id={view.getId()} style={{cursor: view.getActiveTool().getCursor()}}>
                <WindowToolbarStyled>
                    <ToolbarComponent
                        tools={[ToolType.Rectangle, ToolType.Path, ToolType.Select, ToolType.Delete, ToolType.Zoom, ToolType.Pan]}
                        view={view}
                    >
                        <UndoIconComponent isActive={false} disabled={!history.hasUndoHistory()} onClick={() => history.undo()} format="short"/>
                        <RedoIconComponent isActive={false} disabled={!history.hasRedoHistory()} onClick={() => history.redo()} format="short"/>
    
                    </ToolbarComponent>
                </WindowToolbarStyled>
                <CanvasComponentStyled
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
                </CanvasComponentStyled>
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